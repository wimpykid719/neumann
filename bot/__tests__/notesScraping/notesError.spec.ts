import { FetchError } from '@/lib/errors'
import * as fireStoreCustomMethodsModule from '@/lib/fireStore'
import * as noteModule from '@/lib/wrappedFeatch/requests/note'
import { crawling } from '@/notesScraping'
import requestText from '@/text/request.json'
import type { HashTags } from '@/utils/hashTags'

const HASH_TAG = 'ビジネス書評'

jest.mock('@google-cloud/firestore', () => {
  const set = jest.fn().mockImplementation(() => Promise.resolve({}))
  const get = jest.fn().mockImplementation(() =>
    Promise.resolve({
      empty: false,
      docs: [
        {
          data: jest.fn().mockReturnValue({
            failed: true,
            count: 1,
            tag: 'ビジネス書評',
            page: 5,
            timeStamp: 'date',
          }),
          ref: { delete: jest.fn() },
        },
      ],
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
  const notes = [
    ...Array.from({ length: 20 }, (_, k) => k).map(n => {
      return { key: `nd6dd242caf4${n}` }
    }),
  ]

  const errorPageRes = {
    data: {
      count: 624,
      is_last_page: false,
      next_page: 6,
      notes: notes, // 20件記事の詳細情報と著者の詳細情報が入る
    },
  }

  const lastPageRes = {
    data: {
      count: 624,
      is_last_page: true,
      next_page: null,
      notes: notes, // 20件記事の詳細情報と著者の詳細情報が入る
    },
  }

  const errorRes = new FetchError('error occurred', 403)

  describe('再起処理', () => {
    describe('エラーURLが存在する', () => {
      const consoleInfoSpied = jest.spyOn(console, 'info').mockImplementation(() => {})
      const consoleErrorSpied = jest.spyOn(console, 'error').mockImplementation(() => {})
      const getNotesFromHashTagSpied = jest.spyOn(noteModule, 'getNotesFromHashTag')
      getNotesFromHashTagSpied
        .mockImplementationOnce((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: errorPageRes,
          })
        })
        .mockImplementation((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: lastPageRes,
          })
        })
      jest.spyOn(fireStoreCustomMethodsModule, 'deleteDocument')

      afterEach(() => {
        jest.clearAllMocks() // 各テストの後にモックをクリア
      })

      it('エラーURLからクロールが始まる', async () => {
        await crawling(HASH_TAG)

        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 5')
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.noNotesError)
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 6')
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.successCrawling)
        expect(consoleErrorSpied).not.toHaveBeenCalledWith(requestText.noteKeysError)
        expect(noteModule.getNotesFromHashTag).toHaveBeenCalledTimes(2)

        jest.clearAllMocks()
      })

      it('成功した際はenotesErrorから削除', async () => {
        await crawling(HASH_TAG)

        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 5')
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.noNotesError)
        expect(fireStoreCustomMethodsModule.deleteDocument).toHaveBeenCalledTimes(1)
      })

      it('再度エラーの場合クローラ停止', async () => {
        getNotesFromHashTagSpied.mockImplementation((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: errorRes,
          })
        })

        await expect(crawling(HASH_TAG)).rejects.toThrow(requestText.stopCrawling)

        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 5')
        expect(consoleErrorSpied).toHaveBeenCalledWith(requestText.noteKeysError)
        expect(consoleErrorSpied).toHaveBeenCalledWith('error occurred')
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.successCrawling)
        expect(noteModule.getNotesFromHashTag).toHaveBeenCalledTimes(1)
      })
    })
  })
})
