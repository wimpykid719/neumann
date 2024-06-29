import { FetchError } from '@/lib/errors'
import * as noteModule from '@/lib/wrappedFeatch/requests/note'
import type { Note } from '@/lib/wrappedFeatch/requests/note'
import { crawling } from '@/noteScraping'
import * as crawlingModuleForSpy from '@/noteScraping'

import requestText from '@/text/request.json'

jest.mock('@google-cloud/firestore', () => {
  const docsTemplateObject = {
    data: jest.fn().mockReturnValue({
      hashTags: ['ビジネス書評'],
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
  const errorRes = new FetchError('error occurred', 403)

  describe('再起処理', () => {
    const consoleInfoSpied = jest.spyOn(console, 'info').mockImplementation(() => {})
    const consoleErrorSpied = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(crawlingModuleForSpy, 'crawling')

    afterEach(() => {
      jest.clearAllMocks() // 各テストの後にモックをクリア
    })

    // ここのテストが実行される場合は下のテストが失敗します。ループの制限がそのまま引き継がれるためです
    describe('記事詳細取得が全てエラーの場合', () => {
      const getNoteDetailSpied = jest.spyOn(noteModule, 'getNoteDetail')
      getNoteDetailSpied.mockImplementation((key: Note['key']) => {
        return Promise.resolve({
          url: `https://note.com/api/v3/notes/${key}`,
          key,
          res: errorRes,
        })
      })

      it('エラー内容をFirestoreに保存するも処理は止まらず、2回再起処理が行われる', async () => {
        await crawling()

        expect(consoleInfoSpied).toHaveBeenCalledWith(
          requestText.startCrawling,
          `Start from : ${requestText.initialPage}`,
        )
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Start from : xxxxxxxx')
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.noKeys)
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.doneNoteCrawling)
        expect(consoleErrorSpied).toHaveBeenCalledWith(requestText.keyError)
        expect(consoleErrorSpied).toHaveBeenCalledWith('error occurred')

        expect(noteModule.getNoteDetail).toHaveBeenCalledTimes(25)
        expect(crawling).toHaveBeenCalledTimes(2)
      })
    })
  })
})
