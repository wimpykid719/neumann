import { crawling } from '@/amazonBookScraping'
import * as crawlingModuleForSpy from '@/amazonBookScraping'
import * as bookInfoModule from '@/amazonBookScraping/functions/bookInfo'

import requestText from '@/text/request.json'

jest.mock('@google-cloud/firestore', () => {
  const set = jest.fn().mockImplementation(() => Promise.resolve({}))
  const get = jest.fn().mockImplementation(() =>
    Promise.resolve({
      empty: true,
      docs: [],
    }),
  )
  const firestoreMock = {
    settings: jest.fn(),
    databaseId: jest.fn(),
    collection: jest.fn().mockReturnThis(),
    delete: jest.fn(),
    doc: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    startAfter: jest.fn().mockReturnThis(),
    get,
    set,
  }

  return {
    Firestore: jest.fn().mockImplementation(() => firestoreMock),
    FieldValue: { increment: jest.fn(), arrayUnion: jest.fn(), serverTimestamp: jest.fn() },
  }
})

jest.mock('@/utils/sleep', () => ({
  sleep: jest.fn(),
}))

describe('crawling', () => {
  const book = {
    title: 'ビジネス書籍',
    imgUrl: 'https://m.media-amazon.com/images/I/81xnrK2liYL._SL1500_.jpg',
    page: 200,
    launched: '2022/1/18',
    author: 'おで',
    associateUrl:
      'https://www.amazon.co.jp/%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%9E%E3%83%8D%E3%82%B8%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E5%AE%9F%E7%94%A8%E6%80%A7%E3%82%92%E3%82%86%E3%82%8B%EF%BD%9E%E3%81%8F%E7%90%86%E8%A7%A3%E3%81%97%E3%82%88%E3%81%86-%E6%B5%85%E9%96%93-%E3%82%B1%E3%83%B3%E3%83%88-ebook/dp/B09QQPFB2W?tag=hero719-22',
    publisher: 'KADOKAWA',
    price: 2380,
  }

  describe('再起処理', () => {
    const consoleInfoSpied = jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(crawlingModuleForSpy, 'crawling')

    afterEach(() => {
      jest.clearAllMocks() // 各テストの後にモックをクリア
    })

    describe('amazonLinkが保存されていない場合', () => {
      const getBookInfoSpied = jest.spyOn(bookInfoModule, 'getBookInfo')
      getBookInfoSpied.mockImplementation((url: string) => {
        return Promise.resolve({
          asin: 'B09QQPFB2W',
          book,
        })
      })

      it('1回再起処理が行われる', async () => {
        await crawling()

        expect(consoleInfoSpied).toHaveBeenCalledWith(
          requestText.startCrawling,
          `Start from （Amazon書籍情報取得） : ${requestText.initialPage}`,
        )
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(
          requestText.startCrawling,
          'Start from （Amazon書籍情報取得） : xxxxxxxx',
        )
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.noAmazonLinks)
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.doneAmazonCrawling)
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.noAsin)
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(`${requestText.asin} : B09QQPFB2W`)
        expect(bookInfoModule.getBookInfo).toHaveBeenCalledTimes(0)
        expect(crawling).toHaveBeenCalledTimes(1)
      })
    })
  })
})
