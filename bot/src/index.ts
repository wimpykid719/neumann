import { crawling as amazonBookScraping } from './amazonBookScraping'
import { crawling as noteScraping } from './noteScraping'
import { crawling as notesScraping } from './notesScraping'
import { HASH_TAGS } from './utils/hashTags'
import { sleep } from './utils/sleep'
;(async () => {
  await notesScraping(HASH_TAGS[0])
  await sleep(10000)
  await noteScraping()
  await sleep(10000)
  await amazonBookScraping()
})()
