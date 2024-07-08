import { FetchError } from '@/lib/errors'
import { deleteDocument, generateDocRef, notesErrorQuery, storeObjOverWrite } from '@/lib/fireStore'
import { type Note, type Notes, getNotesFromHashTag } from '@/lib/wrappedFeatch/requests/note'
import requestText from '@/text/request.json'
import { base64UrlSafeEncode } from '@/utils/base64url'
import type { HashTags } from '@/utils/hashTags'
import { sleep } from '@/utils/sleep'
import { type DocumentData, FieldValue, Firestore, type QueryDocumentSnapshot } from '@google-cloud/firestore'

type NotesError = {
  failed: boolean
  count: number
  tag: HashTags
  page: number
  timeStamp: FieldValue
}

export const COLLECTION_KEYS = 'keys'
const COLLECTION_ERROR = 'notesError'
const INITIAL_PAGE = 1
const ARTICLE_500 = 25

const firestore = new Firestore()

const stopScraping = async (res: FetchError, url: string, hashtag: HashTags, page: number) => {
  console.error(requestText.noteKeysError)
  console.error(res.message)
  const notesErrorObj = {
    failed: true,
    count: FieldValue.increment(1),
    tag: hashtag,
    page,
    timeStamp: FieldValue.serverTimestamp(),
  }

  await storeObjOverWrite(generateDocRef(firestore, COLLECTION_ERROR, base64UrlSafeEncode(url)), notesErrorObj)
  throw new Error(requestText.stopCrawling)
}

const isInitialPage = (page: number) => INITIAL_PAGE >= page

// 基本はハッシュタグに付き1件ずつしかたまらない（失敗した時点でクロールが停止するため）
const getErrorPages = async (hashtag: HashTags) => {
  const limit = 1
  const pages = await notesErrorQuery(firestore, COLLECTION_ERROR, hashtag, limit).get()
  if (pages.empty) {
    console.info(requestText.noNotesError)
    return
  }

  return pages.docs[0]
}

const checkErrorPage = async (initialHashtag: HashTags, crawlingPage: number) => {
  if (!isInitialPage(crawlingPage)) return { hashtag: initialHashtag, crawlingPage }

  const errorPage = await getErrorPages(initialHashtag)
  if (!errorPage) return { hashtag: initialHashtag, crawlingPage }

  const { tag, page } = errorPage.data() as NotesError

  return { hashtag: tag, crawlingPage: page, docErrorPage: errorPage }
}

const deleteSuccessedErrorPageObj = async (
  docErrorPage: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined,
) => {
  if (docErrorPage) await deleteDocument(docErrorPage)
}

const storeNoteKeysParallelRequest = async (notes: Note[], hashtag: HashTags) => {
  await Promise.all(
    notes.map(async note => {
      const duplicateKeyObj = {
        hashTags: FieldValue.arrayUnion(hashtag),
        timeStamp: FieldValue.serverTimestamp(),
      }
      const keyObj = {
        ...duplicateKeyObj,
        scraping: false,
      }
      const docRef = generateDocRef(firestore, COLLECTION_KEYS, note.key)
      const doc = await docRef.get()

      if (doc.exists) {
        console.info(`${requestText.duplicateArticle} : ${doc.id}`)
        return storeObjOverWrite(docRef, duplicateKeyObj)
      }

      return storeObjOverWrite(docRef, keyObj)
    }),
  )
}

const reCrawling = async (is_last_page: Notes['is_last_page'], next_page: Notes['next_page'], hashtag: HashTags) => {
  if (!is_last_page && next_page && next_page <= ARTICLE_500) {
    await sleep(5000)
    await crawling(hashtag, next_page)
  } else {
    console.info(requestText.successCrawling)
  }
}

export const crawling = async (initialHashtag: HashTags, page = INITIAL_PAGE) => {
  const { hashtag, crawlingPage, docErrorPage } = await checkErrorPage(initialHashtag, page)
  console.info(requestText.startCrawling, `Hashtag : ${hashtag}`, `Page : ${crawlingPage}`)

  const { url, res } = await getNotesFromHashTag(hashtag, crawlingPage)

  if (res instanceof FetchError) {
    await stopScraping(res, url, hashtag, crawlingPage)
  } else {
    const { is_last_page, next_page, notes } = res.data

    await deleteSuccessedErrorPageObj(docErrorPage)
    await storeNoteKeysParallelRequest(notes, hashtag)

    await reCrawling(is_last_page, next_page, hashtag)
  }
}
