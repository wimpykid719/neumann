import { limitQuery } from '@/lib/fireStore'
import { generateDocRef, storeObjOverWrite } from '@/lib/fireStore'
import requestText from '@/text/request.json'
import { type DocumentData, Firestore, type QueryDocumentSnapshot, type QuerySnapshot } from '@google-cloud/firestore'

const COLLECTION_AMAZON_LINKS = 'amazonLinks'
const PAGE_LIMIT = 100

const firestore = new Firestore()

const getAmazonLinks = async (initialPage: QueryDocumentSnapshot | undefined) => {
  const amazonLinks = await limitQuery(firestore, COLLECTION_AMAZON_LINKS, initialPage, PAGE_LIMIT).get()
  if (!amazonLinks.empty) return amazonLinks

  console.info(requestText.noAmazonLinks)
}

const scrapingStatusFalse = async (ids: string[]) => {
  await Promise.all(
    ids.map(id => {
      console.info(requestText.amazonLinksReset, id)
      return storeObjOverWrite(generateDocRef(firestore, COLLECTION_AMAZON_LINKS, id), {
        scraping: false,
      })
    }),
  )
}

const isReCrawling = (objSize: number) => PAGE_LIMIT <= objSize

const extractAmazonLinksData = (amazonLinks: QuerySnapshot<DocumentData, DocumentData>) => {
  const amazonLinksSize = amazonLinks.docs.length
  const lastDocumentIndex = amazonLinksSize - 1
  const nextPage = amazonLinks.docs[lastDocumentIndex]
  const amazonLinksIds = amazonLinks.docs.map(doc => doc.id)

  return { amazonLinksSize, nextPage, amazonLinksIds }
}

const resetScrapingStatus = async (initialPage: QueryDocumentSnapshot | undefined = undefined) => {
  console.info(
    requestText.startCrawling,
    `Start from （AmazonLinksのscrapingをリセット） : ${initialPage ? initialPage.id : requestText.initialPage}`,
  )

  const amazonLinks = await getAmazonLinks(initialPage)
  if (!amazonLinks) return
  const { amazonLinksSize, nextPage, amazonLinksIds } = extractAmazonLinksData(amazonLinks)
  await scrapingStatusFalse(amazonLinksIds)

  if (isReCrawling(amazonLinksSize)) {
    await resetScrapingStatus(nextPage)
  } else {
    console.info(requestText.doneAmazonLinksReset)
  }
}
;(async () => {
  await resetScrapingStatus()
})()
