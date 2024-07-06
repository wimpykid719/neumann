import { crawling } from '@/amazonBookScraping'
import * as crawlingModuleForSpy from '@/amazonBookScraping'
import * as bookInfoModule from '@/amazonBookScraping/functions/bookInfo'

import requestText from '@/text/request.json'

jest.mock('@google-cloud/firestore', () => {
  const docsTemplateObject = {
    data: jest.fn().mockReturnValue({
      hashtags: ['#ビジネス書評', '#マーケティング'],
      productUrls: ['https://www.amazon.co.jp/dp/xxxxxxxxx', 'https://www.amazon.co.jp/dp/yyyyyy'],
      referenceObj: {
        likes: 28,
        title: '【書評】UXリサーチの道具箱　イノベーションのための質的調査・分析',
        url: 'https://note.com/ktaro0157/n/na309197dbafb',
        userProfileImg:
          'https://assets.st-note.com/production/uploads/images/87200981/profile_f42e6f25b6be789ba378b5d150d73826.jpg?fit=bounds&format=jpeg&quality=85&width=330',
      },

      score: 0.028021138211382114,
      scraping: false,
      timeStamp: new Date(),
    }),
    id: 'xxxxxxxx',
    ref: { delete: jest.fn() },
  }
  const set = jest.fn().mockImplementation(() => Promise.resolve({}))
  const get = jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        empty: false,
        docs: Array.from({ length: 20 }, () => ({ ...docsTemplateObject })),
      }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        empty: false,
        docs: Array.from({ length: 5 }, () => ({ ...docsTemplateObject })),
      }),
    )
    .mockImplementation(() =>
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

    describe('amazonLinkが25個保存されている場合', () => {
      const getBookInfoSpied = jest.spyOn(bookInfoModule, 'getBookInfo')
      getBookInfoSpied.mockImplementation((url: string) => {
        return Promise.resolve({
          asin: 'B09QQPFB2W',
          book,
        })
      })

      it('2回再起処理が行われる', async () => {
        await crawling()

        expect(consoleInfoSpied).toHaveBeenCalledWith(
          requestText.startCrawling,
          `Start from （Amazon書籍情報取得） : ${requestText.initialPage}`,
        )
        expect(consoleInfoSpied).toHaveBeenCalledWith(
          requestText.startCrawling,
          'Start from （Amazon書籍情報取得） : xxxxxxxx',
        )
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.noAmazonLinks)
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.doneAmazonCrawling)
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.noAsin)
        expect(consoleInfoSpied).toHaveBeenCalledWith(`${requestText.asin} : B09QQPFB2W`)
        expect(bookInfoModule.getBookInfo).toHaveBeenCalledTimes(25)
        expect(crawling).toHaveBeenCalledTimes(2)
      })
    })
  })
})
