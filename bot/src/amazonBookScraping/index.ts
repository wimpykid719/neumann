import { NotBookError, PuppeteerError } from '@/lib/errors'
import requestText from '@/text/request.json'
import { base64UrlSafeEncode } from '@/utils/base64url'
import { chunkArray } from '@/utils/chunkArray'
import { query } from '@/utils/firestore'
import { sleep } from '@/utils/sleep'
import { FieldValue, Firestore, type QueryDocumentSnapshot } from '@google-cloud/firestore'
import { getASIN } from '../utils/amazon'
import { getBookInfo } from './functions/bookInfo'

type NoteReferences = {
  title: string
  url: string
  likes: number
  userProfileImg: string
}

type AmazonLinks = {
  productUrls: string[]
  score: number
  count: number
  referenceObj: NoteReferences
  hashtags: string[]
  scraping: boolean
  timeStamp: string
}

const COLLECTION_AMAZON_LINKS = 'amazonLinks'
const COLLECTION_AMAZON_ERROR = 'amazonError'
const COLLECTION_NOT_BOOKS = 'notBooksLink'
const COLLECTION_AMAZON_BOOKS = 'amazonBooks'
const PAGE_LIMIT = 10
const CHUNK_SIZE = 5

const firestore = new Firestore()

const amazonLinkFetched = (id: string) => {
  const docRef = firestore.collection(COLLECTION_AMAZON_LINKS).doc(id)

  return docRef.set(
    {
      scraping: true,
      timeStamp: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export const crawling = async (initialPage: QueryDocumentSnapshot | undefined = undefined) => {
  console.info(
    requestText.startCrawling,
    `Start from （Amazon書籍情報取得） : ${initialPage ? initialPage.id : requestText.initialPage}`,
  )

  const amazonLinks = await query(firestore, COLLECTION_AMAZON_LINKS, initialPage, PAGE_LIMIT).get()
  if (amazonLinks.empty) {
    console.info(requestText.noAmazonLinks)
    return
  }

  const lastDocument = amazonLinks.docs[amazonLinks.docs.length - 1]
  const amazonObjs = amazonLinks.docs.map(doc => {
    return { id: doc.id, data: doc.data() as AmazonLinks }
  })

  const amazonObjChunks = chunkArray(amazonObjs, CHUNK_SIZE)

  for (const amazonObjChunk of amazonObjChunks) {
    const bookObjs = await Promise.all(
      amazonObjChunk.map(async obj => {
        const { id, data } = obj
        return {
          id,
          booksInfo: await Promise.all(
            data['productUrls'].map(async productUrl => {
              return { info: await getBookInfo(productUrl), url: productUrl }
            }),
          ),
          linkInfo: data,
        }
      }),
    )

    await Promise.all(
      bookObjs.map(bookObj => {
        const { id, booksInfo, linkInfo } = bookObj

        for (const bookInfo of booksInfo) {
          const { info, url } = bookInfo

          if (info instanceof PuppeteerError) {
            console.error(info.message)
            const documentId = getASIN(url) || url

            const docRef = firestore.collection(COLLECTION_AMAZON_ERROR).doc(base64UrlSafeEncode(documentId))

            return docRef.set({
              failed: true,
              count: FieldValue.increment(1),
              productUrl: url,
            })
          } else if (info instanceof NotBookError) {
            console.error(info.message)
            const documentId = getASIN(url) || url

            const docRef = firestore.collection(COLLECTION_NOT_BOOKS).doc(base64UrlSafeEncode(documentId))

            return docRef.set({
              productUrl: url,
            })
          } else {
            const { asin, book } = info
            if (!asin) {
              console.info(requestText.noAsin)
              return
            }

            console.info(`${requestText.asin} : ${asin}`)

            const docRef = firestore.collection(COLLECTION_AMAZON_BOOKS).doc(asin)
            docRef.set(
              {
                score: FieldValue.increment(linkInfo['score']),
                count: FieldValue.increment(1),
                referenceObj: FieldValue.arrayUnion(linkInfo['referenceObj']),
                hashtags: FieldValue.arrayUnion(...linkInfo['hashtags']),
                book: book,
                scraping: false,
                timeStamp: FieldValue.serverTimestamp(),
              },
              { merge: true },
            )
          }
        }

        return amazonLinkFetched(id)
      }),
    )

    // リクエスト実行後は5秒間待機して次のリクエストを行う
    await sleep(5000)
  }

  // 取得したAmazonLinksの数が制限よりも少ない場合は最後ページと判定、それ以外は処理を繰り返す
  if (PAGE_LIMIT <= amazonLinks.docs.length) {
    await crawling(lastDocument)
  } else {
    console.info(requestText.doneAmazonCrawling)
  }
}
