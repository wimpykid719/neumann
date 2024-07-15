import { NotBookError, PuppeteerError, ScrapingRequestError } from '@/lib/errors'
import { generateDocRef, notScrapingQuery, storeObjOverWrite } from '@/lib/fireStore'
import requestText from '@/text/request.json'
import { base64UrlSafeEncode } from '@/utils/base64url'
import { chunkArray } from '@/utils/chunkArray'
import { sleep } from '@/utils/sleep'
import {
  type DocumentData,
  FieldValue,
  Firestore,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
} from '@google-cloud/firestore'
import { getASIN } from '../utils/amazon'
import { getBookInfo } from './functions/bookInfo'

type NoteReferences = {
  title: string
  url: string
  likes: number
  userProfileImg: string
}

type AmazonLinks = {
  productUrl: string
  score: number
  count: number
  referenceObj: NoteReferences
  hashtags: string[]
  scraping: boolean
  timeStamp: string
}

type AmazonObj = {
  id: string
  data: AmazonLinks
}

type BookInfo = {
  asin: string | undefined
  book: {
    title: string
    imgUrl: string
    page: number
    launched: string
    author: string
    associateUrl: string
    publisher: string
    price: number
  }
}

const COLLECTION_AMAZON_LINKS = 'amazonLinks'
const COLLECTION_AMAZON_ERROR = 'amazonError'
const COLLECTION_NOT_BOOKS = 'notBooksLink'
const COLLECTION_AMAZON_BOOKS = 'amazonBooks'
const PAGE_LIMIT = 10
const CHUNK_SIZE = 5

const firestore = new Firestore()

const amazonLinkScraped = (id: string) => {
  const docRef = firestore.collection(COLLECTION_AMAZON_LINKS).doc(id)

  return docRef.set(
    {
      scraping: true,
      timeStamp: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

const getAmazonLinks = async (initialPage: QueryDocumentSnapshot | undefined) => {
  const amazonLinks = await notScrapingQuery(firestore, COLLECTION_AMAZON_LINKS, initialPage, PAGE_LIMIT).get()
  if (!amazonLinks.empty) return amazonLinks

  console.info(requestText.noAmazonLinks)
}

const storeNotBookError = async (bookInfo: NotBookError, id: AmazonObj['id']) => {
  const { message, url } = bookInfo
  console.error(message)
  const documentId = getASIN(url) || url
  const notBookErrorObj = { productUrl: url }

  await storeObjOverWrite(
    generateDocRef(firestore, COLLECTION_NOT_BOOKS, base64UrlSafeEncode(documentId)),
    notBookErrorObj,
  )

  return amazonLinkScraped(id)
}

const storePuppeteerError = (bookInfo: PuppeteerError) => {
  const { message, url } = bookInfo
  console.error(message)

  const documentId = getASIN(url) || url
  const puppeteerErrorObj = {
    failed: true,
    count: FieldValue.increment(1),
    productUrl: url,
  }

  return storeObjOverWrite(
    generateDocRef(firestore, COLLECTION_AMAZON_ERROR, base64UrlSafeEncode(documentId)),
    puppeteerErrorObj,
  )
}

const forceExsitScrapingRequestError = (bookInfo: ScrapingRequestError) => {
  const { message, url } = bookInfo

  console.error(message)
  console.error(requestText.amazonRequestError, url)
  process.exit(1)
}

const storeBook = async (bookInfo: BookInfo, linkInfo: AmazonLinks, id: AmazonObj['id']) => {
  const { asin, book } = bookInfo
  if (!asin) {
    console.error(`${requestText.noAsin} : error AmazonLinks doc id ${id}`)
    return
  }

  console.info(`${requestText.asin} : ${asin}`)
  const bookObj = {
    score: FieldValue.increment(linkInfo['score']),
    count: FieldValue.increment(1),
    referenceObj: FieldValue.arrayUnion(linkInfo['referenceObj']),
    hashtags: FieldValue.arrayUnion(...linkInfo['hashtags']),
    book: book,
    scraping: false,
    timeStamp: FieldValue.serverTimestamp(),
  }

  await storeObjOverWrite(generateDocRef(firestore, COLLECTION_AMAZON_BOOKS, asin), bookObj)

  return amazonLinkScraped(id)
}

const generateAmazonObj = async (amazonObjs: AmazonObj[]) => {
  return await Promise.all(
    amazonObjs.map(async amazonObj => {
      const { id, data } = amazonObj
      return {
        id,
        bookInfo: await getBookInfo(data['productUrl']),
        linkInfo: data,
      }
    }),
  )
}

const batchAmazonLinksRequestStoreBook = async (amazonObjs: AmazonObj[]) => {
  const amazonObjChunk = chunkArray(amazonObjs, CHUNK_SIZE)
  for (const amazonObjs of amazonObjChunk) {
    const bookObjs = await generateAmazonObj(amazonObjs)

    await Promise.all(
      bookObjs.map(bookObj => {
        const { id, bookInfo, linkInfo } = bookObj

        if (bookInfo instanceof ScrapingRequestError) return forceExsitScrapingRequestError(bookInfo)
        if (bookInfo instanceof PuppeteerError) return storePuppeteerError(bookInfo)
        if (bookInfo instanceof NotBookError) return storeNotBookError(bookInfo, id)

        return storeBook(bookInfo, linkInfo, id)
      }),
    )

    await sleep(5000)
  }
}

const isReCrawling = (objSize: number) => PAGE_LIMIT <= objSize

const extractAmazonLinksData = (amazonLinks: QuerySnapshot<DocumentData, DocumentData>) => {
  const amazonLinksSize = amazonLinks.docs.length
  const lastDocumentIndex = amazonLinksSize - 1
  const nextPage = amazonLinks.docs[lastDocumentIndex]
  const amazonObjs = amazonLinks.docs.map(doc => {
    return { id: doc.id, data: doc.data() as AmazonLinks }
  })

  return { amazonLinksSize, nextPage, amazonObjs }
}

export const crawling = async (initialPage: QueryDocumentSnapshot | undefined = undefined) => {
  console.info(
    requestText.startCrawling,
    `Start from （Amazon書籍情報取得） : ${initialPage ? initialPage.id : requestText.initialPage}`,
  )

  const amazonLinks = await getAmazonLinks(initialPage)
  if (!amazonLinks) return

  const { amazonLinksSize, nextPage, amazonObjs } = extractAmazonLinksData(amazonLinks)
  await batchAmazonLinksRequestStoreBook(amazonObjs)

  // 取得したAmazonLinksの数が制限よりも少ない場合は最後ページと判定、それ以外は処理を繰り返す
  if (isReCrawling(amazonLinksSize)) {
    await crawling(nextPage)
  } else {
    console.info(requestText.doneAmazonCrawling)
  }
}
