import { FetchError } from '@/lib/errors'
import { getNotesFromHashTag } from '@/lib/wrappedFeatch/requests/note'
import requestText from '@/text/request.json'
import { base64UrlSafeEncode } from '@/utils/base64url'
import type { HashTags } from '@/utils/hashTags'
import { HASH_TAGS } from '@/utils/hashTags'
import { sleep } from '@/utils/sleep'
import { FieldValue, Firestore } from '@google-cloud/firestore'

const firestore = new Firestore()
let i = 0

const stopScraping = async (res: FetchError, url: string, hashtag: HashTags, page: number) => {
  console.error(requestText.noteKeysError)
  console.error(res.message)

  const docRef = firestore.collection('notesError').doc(base64UrlSafeEncode(url))
  await docRef.set(
    {
      failed: true,
      count: FieldValue.increment(1),
      tag: hashtag,
      page: page,
    },
    { merge: true },
  )

  throw new Error(requestText.stopCrawling)
}

export const crawling = async (hashtag: HashTags, page = 1) => {
  i++
  console.info(requestText.startCrawling, `Hashtag : ${hashtag}`, `Page : ${page}`)

  const { url, res } = await getNotesFromHashTag(hashtag, page)
  if (res instanceof FetchError) {
    await stopScraping(res, url, hashtag, page)
  } else {
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
;(async () => {
  await crawling(HASH_TAGS[0])
})()
