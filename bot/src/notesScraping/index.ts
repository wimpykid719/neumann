import { FetchError } from '@/lib/errors'
import { deleteDocument } from '@/lib/fireStore'
import { getNotesFromHashTag } from '@/lib/wrappedFeatch/requests/note'
import requestText from '@/text/request.json'
import { base64UrlSafeEncode } from '@/utils/base64url'
import type { HashTags } from '@/utils/hashTags'
import { sleep } from '@/utils/sleep'
import { FieldValue, Firestore } from '@google-cloud/firestore'

type NotesError = {
  failed: boolean
  count: number
  tag: HashTags
  page: number
  timeStamp: FieldValue
}

const firestore = new Firestore()
const COLLECTION_ERROR = 'notesError'
const INITIAL_PAGE = 1
let i = 0

const stopScraping = async (res: FetchError, url: string, hashtag: HashTags, page: number) => {
  console.error(requestText.noteKeysError)
  console.error(res.message)

  const docRef = firestore.collection(COLLECTION_ERROR).doc(base64UrlSafeEncode(url))
  await docRef.set(
    {
      failed: true,
      count: FieldValue.increment(1),
      tag: hashtag,
      page,
      timeStamp: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  throw new Error(requestText.stopCrawling)
}

// 基本はハッシュタグに付き1件ずつしかたまらない（失敗した時点でクロールが停止するため）
const getErrorPages = async (hashtag: HashTags) => {
  const pages = await firestore.collection(COLLECTION_ERROR).where('tag', '==', hashtag).limit(1).get()
  if (pages.empty) {
    console.info(requestText.noNotesError)
    return
  }

  return pages.docs[0]
}

const checkErrorPage = async (initialHashtag: HashTags, initialPage: number) => {
  if (INITIAL_PAGE >= initialPage) {
    const errorPage = await getErrorPages(initialHashtag)
    if (!errorPage) return { hashtag: initialHashtag, page: initialPage }

    const { tag, page } = errorPage.data() as NotesError
    return { hashtag: tag, page, docErrorPage: errorPage }
  }

  return { hashtag: initialHashtag, page: initialPage }
}

export const crawling = async (initialHashtag: HashTags, initialPage = INITIAL_PAGE) => {
  const { hashtag, page, docErrorPage } = await checkErrorPage(initialHashtag, initialPage)
  i++
  console.info(requestText.startCrawling, `Hashtag : ${hashtag}`, `Page : ${page}`)

  const { url, res } = await getNotesFromHashTag(hashtag, page)

  if (res instanceof FetchError) {
    await stopScraping(res, url, hashtag, page)
  } else {
    if (docErrorPage) await deleteDocument(docErrorPage)

    const { is_last_page, next_page, notes } = res.data
    // Firestore記事のkeysを保存
    await Promise.all(
      notes.map(note => {
        const docRef = firestore.collection('keys').doc(note.key)

        // keyが重複するする場合はハッシュタグだけ追記して更新する
        return docRef.set(
          {
            hashTags: FieldValue.arrayUnion(hashtag),
            scraping: false,
            timeStamp: FieldValue.serverTimestamp(),
          },
          { merge: true },
        )
      }),
    )

    // 次のページが存在する場合は再起的に上記の処理を繰り返す
    if (!is_last_page && next_page && i < 3) {
      // 5秒間の待機処理
      await sleep(5000)
      await crawling(hashtag, next_page)
    } else {
      console.info(requestText.successCrawling)
    }
  }
}
// ;(async () => {
//   await crawling(HASH_TAGS[0])
// })()
