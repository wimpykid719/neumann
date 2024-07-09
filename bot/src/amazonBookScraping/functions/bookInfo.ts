import { NotBookError, PuppeteerError, ScrapingRequestError } from '@/lib/errors'
import requestText from '@/text/request.json'
import { getASIN } from '@/utils/amazon'
import puppeteer, { type Page } from 'puppeteer'

const AFFILIATE_TAG = 'hero719-22'

const BOOK_CATEGORIES = ['本', 'Kindleストア', 'Kindle本'] as const
const PRICE_ELEMENT_PATH = [
  '#tmm-grid-swatch-PAPERBACK .slot-price > span',
  '#tmm-grid-swatch-KINDLE .slot-price > span',
  '#tmm-grid-swatch-OTHER .slot-price > span',
] as const
type PricePath = (typeof PRICE_ELEMENT_PATH)[number]

const PAGE_ELEMENT_PATH = [
  '#rpi-attribute-book_details-fiona_pages .rpi-attribute-value > span',
  '#rpi-attribute-book_details-ebook_pages .rpi-attribute-value > span > a > span',
] as const
type BookPagePath = (typeof PAGE_ELEMENT_PATH)[number]

const PUBLISHER_ELEMENT_PATH = ['#rpi-attribute-book_details-publisher .rpi-attribute-value > span'] as const
type PublisherPath = (typeof PUBLISHER_ELEMENT_PATH)[number]

const isRequestFailed = async (page: Page) =>
  await elementExists(page, 'form[method="get"][action="/errors/validateCaptcha"][name=""]')

const isBook = async (page: Page) => {
  const breadcrumbs = await page.$$eval(
    '#wayfinding-breadcrumbs_feature_div ul.a-unordered-list a.a-link-normal',
    elements => elements.map(element => element.textContent?.trim() || ''),
  )
  const includesInBookCategory = (element: string) => BOOK_CATEGORIES.some(BOOK_CATEGORIE => BOOK_CATEGORIE === element)

  return breadcrumbs.some(includesInBookCategory)
}

const getTextFromDom = async (path: string, page: Page) =>
  await page.$eval(path, element => element.textContent?.trim() || '')

const getTitle = async (page: Page) => {
  const titlePath = '#productTitle'

  return await getTextFromDom(titlePath, page)
}

const elementExists = async (page: Page, selector: string) => (await page.$(selector)) !== null

const exsistElement = async (
  page: Page,
  paths: readonly PricePath[] | readonly BookPagePath[] | readonly PublisherPath[],
) => {
  for (const path of paths) {
    if (await elementExists(page, path)) return path
  }
}

const extractNumberFromText = (priceString: string | undefined) =>
  priceString ? Number(priceString.replace(/[^0-9]/g, '')) : 0

const getPrice = async (page: Page) => {
  const path = await exsistElement(page, PRICE_ELEMENT_PATH)
  if (!path) return

  return await page.$eval(path, element => element.textContent?.trim() || '')
}

const getBookPage = async (page: Page) => {
  const path = await exsistElement(page, PAGE_ELEMENT_PATH)
  if (!path) return

  return await getTextFromDom(path, page)
}

const getPublisher = async (page: Page) => {
  const path = await exsistElement(page, PUBLISHER_ELEMENT_PATH)
  if (!path) return ''

  return await getTextFromDom(path, page)
}

const getLaunched = async (page: Page) => {
  const bookLaunchedPath = '#rpi-attribute-book_details-publication_date .rpi-attribute-value > span'

  return await getTextFromDom(bookLaunchedPath, page)
}

const getAuthor = async (page: Page) => {
  const bookAuthorPath = '#bylineInfo .author > a'

  return await getTextFromDom(bookAuthorPath, page)
}

const getImgURL = async (page: Page) => {
  const bookImagePath = '#landingImage'

  return page.$eval(bookImagePath, imgElement => {
    const dataOldHires = imgElement.getAttribute('data-old-hires')
    if (dataOldHires) return dataOldHires

    return (imgElement as HTMLImageElement).src
  })
}

const getBookASIN = (page: Page) => getASIN(page.url())

const generateAmazonAffiliateLink = (productUrl: string, tagId: string) => {
  const { origin, pathname } = new URL(productUrl)

  return origin + pathname + `?tag=${tagId}`
}

const settingsCookie = async (page: Page) => {
  const amazonPageLanguageCookie = { domain: '.amazon.co.jp', name: 'lc-acbjp', value: 'ja_JP' }
  const cookies = [amazonPageLanguageCookie]

  await page.setCookie(...cookies)

  return page
}

const settingsPage = async (page: Page) => await settingsCookie(page)

const initialPuppeteer = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })

  return { page: await settingsPage(await browser.newPage()), browser }
}

export const getBookInfo = async (url: string) => {
  const { page, browser } = await initialPuppeteer()

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    if (await isRequestFailed(page)) return new ScrapingRequestError(requestText.scrapingRequestError, url)

    if (!(await isBook(page))) {
      await browser.close()

      return new NotBookError(requestText.notBook, url)
    }

    const asin = getBookASIN(page)

    const book = {
      title: await getTitle(page),
      imgUrl: await getImgURL(page),
      page: extractNumberFromText(await getBookPage(page)),
      launched: await getLaunched(page),
      author: await getAuthor(page),
      associateUrl: generateAmazonAffiliateLink(page.url(), AFFILIATE_TAG),
      publisher: await getPublisher(page),
      price: extractNumberFromText(await getPrice(page)),
    }
    await browser.close()
    console.info(requestText.puppeteerClose)
    console.info(book)

    return { asin, book }
  } catch (error) {
    console.error(error)

    console.info(requestText.forceCloseScraping)
    await browser.close()

    return new PuppeteerError(requestText.errorScraping, url)
  }
}
