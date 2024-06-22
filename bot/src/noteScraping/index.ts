import { FetchError } from '@/lib/errors'
import { type Note, getNoteDetail } from '@/lib/wrappedFeatch/requests/note'
import { COLLECTION_KEYS } from '@/notesScraping'
import requestText from '@/text/request.json'
import { base64UrlSafeEncode } from '@/utils/base64url'
import { chunkArray } from '@/utils/chunkArray'
import { sleep } from '@/utils/sleep'
import { FieldValue, Firestore, type QueryDocumentSnapshot } from '@google-cloud/firestore'
import { getASIN, getAmazonEmbeds } from '../utils/amazon'
import { evaluateScore } from './functions/score'

const COLLECTION_AMAZON_LINKS = 'amazonLinks'
const COLLECTION_NOTE_ERROR = 'noteError'
const PAGE_LIMIT = 10
const CHUNK_SIZE = 5
let i = 0

const firestore = new Firestore()

const query = (lastDocument: QueryDocumentSnapshot | undefined, limit: number) => {
  if (lastDocument) {
    return firestore.collection('keys').where('scraping', '==', false).limit(limit).startAfter(lastDocument)
  }

  return firestore.collection('keys').where('scraping', '==', false).limit(limit)
}

const noteKeysFetched = async (keys: Note['key'][]) => {
  await Promise.all(
    keys.map(key => {
      const docRef = firestore.collection(COLLECTION_KEYS).doc(key)

      return docRef.set(
        {
          scraping: true,
          timeStamp: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
    }),
  )
}

export const crawling = async (initialPage: QueryDocumentSnapshot | undefined = undefined) => {
  i++
  console.info(requestText.startCrawling, `Start from : ${initialPage ? initialPage.id : requestText.initialPage}`)

  const noteKeys = await query(initialPage, PAGE_LIMIT).get()
  if (noteKeys.empty) {
    console.info(requestText.noKeys)
    return
  }

  const lastDocument = noteKeys.docs[noteKeys.docs.length - 1]
  const keys = noteKeys.docs.map(key => key.id)

  await noteKeysFetched(keys)

  const keyChunks = chunkArray(keys, CHUNK_SIZE)

  for (const keyChunk of keyChunks) {
    // Note APIを叩く処理を５リクエストずつ並列で行う
    const notesDetail = await Promise.all(keyChunk.map(key => getNoteDetail(key)))

    // Firestoreも上記に合わせて5記事分データを並行に保存
    await Promise.all(
      notesDetail.map(noteDetail => {
        const { url, key, res } = noteDetail

        if (res instanceof FetchError) {
          console.error(requestText.keyError)
          console.error(res.message)

          const docRef = firestore.collection(COLLECTION_NOTE_ERROR).doc(base64UrlSafeEncode(url))

          return docRef.set({
            failed: true,
            count: FieldValue.increment(1),
            key,
            timeStamp: FieldValue.serverTimestamp(),
          })
        } else {
          const { name, user, like_count, hashtag_notes, publish_at, embedded_contents, note_url } = res.data
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
          const amazonEmbeds = getAmazonEmbeds(embedded_contents)

          amazonEmbeds.map(amazonEmbed => {
            console.info(`${requestText.amazonUrl} : ${amazonEmbed.url}`)
            const documentId = getASIN(amazonEmbed.url) || amazonEmbed.url

            const docRef = firestore.collection(COLLECTION_AMAZON_LINKS).doc(base64UrlSafeEncode(documentId))

            return docRef.set(
              {
                productUrl: amazonEmbed.url,
                score: FieldValue.increment(evaluateScore(scoreValue)),
                count: FieldValue.increment(1),
                referenceObj: FieldValue.arrayUnion(noteReferencesObj),
                hashtags: FieldValue.arrayUnion(...hashtagNames),
                timeStamp: FieldValue.serverTimestamp(),
              },
              { merge: true },
            )
          })
        }
      }),
    )

    // リクエスト実行後は5秒間待機して次のリクエストを行う
    await sleep(5000)
  }

  // 取得したkeyの数が制限よりも少ない場合は最後ページと判定、それ以外は処理を繰り返す
  if (PAGE_LIMIT <= noteKeys.docs.length && i < 3) {
    await crawling(lastDocument)
  } else {
    console.info(requestText.doneNoteCrawling)
  }
}
// ;(async () => {
//   await crawling()
// })()
