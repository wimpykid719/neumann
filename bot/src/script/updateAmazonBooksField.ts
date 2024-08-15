import { limitQuery } from '@/lib/fireStore'
import { generateDocRef, updateObjField } from '@/lib/fireStore'
import requestText from '@/text/request.json'
import { cleanAmazonUrl } from '@/utils/amazon'
import { type DocumentData, Firestore, type QueryDocumentSnapshot, type QuerySnapshot } from '@google-cloud/firestore'

type Book = {
  title: string
  imgUrl: string
  page: number
  launched: string
  author: string
  associateUrl: string
  publisher: string
  price: number
}

type NoteReferences = {
  title: string
  url: string
  likes: number
  userProfileImg: string
}

type AmazonBook = {
  book: Book
  score: number
  count: number
  referenceObj: NoteReferences
  hashtags: string[]
  scraping: boolean
  timeStamp: string
}

type AmazonBooksObj = { id: string; data: AmazonBook }

const COLLECTION_AMAZON_BOOKS = 'amazonBooks'
const PAGE_LIMIT = 100
const firestore = new Firestore()

const generateAmazonAffiliateLink = (productUrl: string, tagId: string) => {
  const { origin, pathname } = new URL(cleanAmazonUrl(productUrl))

  return origin + pathname + `/ref=nosim?tag=${tagId}`
}

const getAmazonBooks = async (initialPage: QueryDocumentSnapshot | undefined) => {
  const amazonBooks = await limitQuery(firestore, COLLECTION_AMAZON_BOOKS, initialPage, PAGE_LIMIT).get()
  if (!amazonBooks.empty) return amazonBooks

  console.info(requestText.noAmazonBooks)
}

const updateAmazonBookField = async (amazonBooksObjs: AmazonBooksObj[]) => {
  await Promise.all(
    amazonBooksObjs.map(amazonBooksObj => {
      const { id, data } = amazonBooksObj
      console.info(requestText.updateAmazonBook, id)
      return updateObjField(generateDocRef(firestore, COLLECTION_AMAZON_BOOKS, id), {
        'book.associateUrl': generateAmazonAffiliateLink(data.book.associateUrl, process.env.PARTNER_TAG!),
        scraping: false,
      })
    }),
  )
}

const isReCrawling = (objSize: number) => PAGE_LIMIT <= objSize

const extractAmazonBooksData = (amazonBooks: QuerySnapshot<DocumentData, DocumentData>) => {
  const amazonBooksSize = amazonBooks.docs.length
  const lastDocumentIndex = amazonBooksSize - 1
  const nextPage = amazonBooks.docs[lastDocumentIndex]
  const amazonBooksObjs = amazonBooks.docs.map(doc => {
    return { id: doc.id, data: doc.data() as AmazonBook }
  })

  return { amazonBooksSize, nextPage, amazonBooksObjs }
}

const updateAmazonBooks = async (initialPage: QueryDocumentSnapshot | undefined = undefined) => {
  console.info(
    requestText.startCrawling,
    `Start from （AmazonBookのフィールド更新） : ${initialPage ? initialPage.id : requestText.initialPage}`,
  )

  const amazonBooks = await getAmazonBooks(initialPage)
  if (!amazonBooks) return
  const { amazonBooksSize, nextPage, amazonBooksObjs } = extractAmazonBooksData(amazonBooks)
  console.log(amazonBooksObjs)
  await updateAmazonBookField(amazonBooksObjs)

  if (isReCrawling(amazonBooksSize)) {
    await updateAmazonBooks(nextPage)
  } else {
    console.info(requestText.doneAmazonBooksUpdate)
  }
}
;(async () => {
  await updateAmazonBooks()
})()
