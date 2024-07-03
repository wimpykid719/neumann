import { FetchError } from '@/lib/errors'
import { generateDocRef, notScrapingQuery, storeObjOverWrite } from '@/lib/fireStore'
import { type Note, type NoteDetail, getNoteDetail } from '@/lib/wrappedFeatch/requests/note'
import { COLLECTION_KEYS } from '@/notesScraping'
import requestText from '@/text/request.json'
import { base64UrlSafeEncode } from '@/utils/base64url'
import { chunkArray } from '@/utils/chunkArray'
import { sleep } from '@/utils/sleep'
import { FieldValue, Firestore, type QueryDocumentSnapshot } from '@google-cloud/firestore'
import { getAmazonEmbeds } from '../utils/amazon'
import { evaluateScore } from './functions/score'

const COLLECTION_AMAZON_LINKS = 'amazonLinks'
const COLLECTION_NOTE_ERROR = 'noteError'
const PAGE_LIMIT = 10
const CHUNK_SIZE = 5

const firestore = new Firestore()

const noteKeyScraped = (key: Note['key']) => {
  const keyObj = {
    scraping: true,
    timeStamp: FieldValue.serverTimestamp(),
  }

  return storeObjOverWrite(generateDocRef(firestore, COLLECTION_KEYS, key), keyObj)
}

const getNoteDetailParallelRequest = async (keys: Note['key'][]) => {
  return await Promise.all(
    keys.map(async key => {
      return { id: key, noteDetail: await getNoteDetail(key) }
    }),
  )
}

const storeNoteError = (res: FetchError, key: Note['key'], url: string) => {
  console.error(requestText.keyError)
  console.error(res.message)

  const noteErrorObj = {
    failed: true,
    count: FieldValue.increment(1),
    key,
    timeStamp: FieldValue.serverTimestamp(),
  }

  return storeObjOverWrite(generateDocRef(firestore, COLLECTION_NOTE_ERROR, base64UrlSafeEncode(url)), noteErrorObj)
}

const getNoteKeys = async (initialPage: QueryDocumentSnapshot | undefined) => {
  const noteKeys = await notScrapingQuery(firestore, COLLECTION_KEYS, initialPage, PAGE_LIMIT).get()
  if (!noteKeys.empty) return noteKeys

  console.info(requestText.noKeys)
}

const storeAmazonLinks = (res: NoteDetail, amazonEmbed: string) => {
  console.info(`${requestText.amazonUrl} : ${amazonEmbed}`)

  const { name, user, like_count, hashtag_notes, publish_at, note_url } = res
  const { follower_count, following_count, user_profile_image_path } = user
  const hashtagNames = hashtag_notes.map(tagObj => tagObj.hashtag.name)
  const scoreValue = {
    likes: like_count,
    publishedDate: new Date(publish_at),
    user: { followers: follower_count, following: following_count },
  }
  const noteReferencesObj = {
    title: name,
    url: note_url,
    likes: like_count,
    userProfileImg: user_profile_image_path,
  }

  const amazonLinksObj = {
    productUrl: amazonEmbed,
    score: FieldValue.increment(evaluateScore(scoreValue)),
    referenceObj: noteReferencesObj,
    hashtags: hashtagNames,
    scraping: false,
    timeStamp: FieldValue.serverTimestamp(),
  }

  return storeObjOverWrite(generateDocRef(firestore, COLLECTION_AMAZON_LINKS), amazonLinksObj)
}

const conditionallyStoreAmazonLinks = async (res: NoteDetail, id: Note['key']) => {
  const { embedded_contents, note_url } = res
  console.info(`${requestText.noteUrl} : ${note_url}`)

  await Promise.all(getAmazonEmbeds(embedded_contents).map(amazonEmbed => storeAmazonLinks(res, amazonEmbed)))
  return noteKeyScraped(id)
}

const batchNoteDetailRequestStoreAmazonLinks = async (keys: string[]) => {
  const keyChunk = chunkArray(keys, CHUNK_SIZE)
  for (const keys of keyChunk) {
    const notes = await getNoteDetailParallelRequest(keys)

    // Firestoreも上記に合わせて5記事分データを並行に保存（取得出来たAmazonURLによってFirestoreへのリクエスト数が可変する）
    await Promise.all(
      notes.map(note => {
        const { id, noteDetail } = note
        const { url, key, res } = noteDetail

        if (res instanceof FetchError) return storeNoteError(res, key, url)

        return conditionallyStoreAmazonLinks(res.data, id)
      }),
    )

    await sleep(10000)
  }
}

export const crawling = async (initialPage: QueryDocumentSnapshot | undefined = undefined) => {
  console.info(requestText.startCrawling, `Start from : ${initialPage ? initialPage.id : requestText.initialPage}`)

  const noteKeys = await getNoteKeys(initialPage)
  if (!noteKeys) return

  const lastDocumentIndex = noteKeys.docs.length
  const crawlingPage = noteKeys.docs[lastDocumentIndex - 1]
  await batchNoteDetailRequestStoreAmazonLinks(noteKeys.docs.map(key => key.id))

  // 取得したkeyの数が制限よりも少ない場合は最後ページと判定、それ以外は処理を繰り返す
  if (PAGE_LIMIT <= lastDocumentIndex) {
    await crawling(crawlingPage)
  } else {
    console.info(requestText.doneNoteCrawling)
  }
}
