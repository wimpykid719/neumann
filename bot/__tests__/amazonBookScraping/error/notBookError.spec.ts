import { crawling } from '@/amazonBookScraping'
import * as crawlingModuleForSpy from '@/amazonBookScraping'
import * as bookInfoModule from '@/amazonBookScraping/functions/bookInfo'
import { NotBookError } from '@/lib/errors'

import requestText from '@/text/request.json'

jest.mock('@google-cloud/firestore', () => {
  const docsTemplateObject = {
    data: jest.fn().mockReturnValue({
      hashtags: ['#ビジネス書評', '#マーケティング'],
      productUrl: 'https://www.amazon.co.jp/dp/xxxxxxxxx',
      referenceObj: [
        {
          likes: 28,
          title: '【書評】UXリサーチの道具箱　イノベーションのための質的調査・分析',
          url: 'https://note.com/ktaro0157/n/na309197dbafb',
          userProfileImg:
            'https://assets.st-note.com/production/uploads/images/87200981/profile_f42e6f25b6be789ba378b5d150d73826.jpg?fit=bounds&format=jpeg&quality=85&width=330',
        },
      ],
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
  const notBookErrorRes = new NotBookError('NotBookError occurred', 'https://www.amazon.co.jp/dp/xxxxxxxxx')

  describe('再起処理', () => {
    const consoleInfoSpied = jest.spyOn(console, 'info').mockImplementation(() => {})
    const consoleErrorSpied = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(crawlingModuleForSpy, 'crawling')

    afterEach(() => {
      jest.clearAllMocks() // 各テストの後にモックをクリア
    })

    describe('全てnotBookErrorResの場合', () => {
      const getBookInfoSpied = jest.spyOn(bookInfoModule, 'getBookInfo')
      getBookInfoSpied.mockImplementation((url: string) => {
        return Promise.resolve(notBookErrorRes)
      })

      it('エラー内容をFirestoreに保存するも処理は止まらず、2回再起処理が行われる', async () => {
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
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(`${requestText.asin} : B09QQPFB2W`)
        expect(consoleErrorSpied).toHaveBeenCalledWith('NotBookError occurred')

        expect(bookInfoModule.getBookInfo).toHaveBeenCalledTimes(25)
        expect(crawling).toHaveBeenCalledTimes(2)
      })
    })
  })
})
