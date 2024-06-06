import { FetchError } from '@/lib/errors'
import * as noteModule from '@/lib/wrappedFeatch/requests/note'
import { crawling } from '@/notesScraping'
import requestText from '@/text/request.json'
import type { HashTags } from '@/utils/hashTags'

const HASH_TAG = 'ビジネス書評'

jest.mock('@google-cloud/firestore', () => {
  const set = jest.fn().mockImplementation(() => Promise.resolve({}))
  const get = jest.fn().mockImplementation(() => Promise.resolve({ empty: true, docs: [] }))
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

  const firstPageRes = {
    data: {
      count: 624,
      is_last_page: false,
      next_page: 2,
      notes: notes, // 20件記事の詳細情報と著者の詳細情報が入る
    },
  }

  const secondPageRes = {
    data: {
      count: 624,
      is_last_page: false,
      next_page: 3,
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
    const consoleInfoSpied = jest.spyOn(console, 'info').mockImplementation(() => {})
    const consoleErrorSpied = jest.spyOn(console, 'error').mockImplementation(() => {})

    afterEach(() => {
      jest.clearAllMocks() // 各テストの後にモックをクリア
    })

    describe('3ページの場合', () => {
      const getNotesFromHashTagSpied = jest.spyOn(noteModule, 'getNotesFromHashTag')
      getNotesFromHashTagSpied
        .mockImplementationOnce((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: firstPageRes,
          })
        })
        .mockImplementationOnce((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: secondPageRes,
          })
        })
        .mockImplementation((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: lastPageRes,
          })
        })

      it('3回再起処理が行われる', async () => {
        await crawling(HASH_TAG)

        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 1')
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.noNotesError)
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 2')
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 3')
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.successCrawling)
        expect(consoleErrorSpied).not.toHaveBeenCalledWith(requestText.noteKeysError)
        expect(noteModule.getNotesFromHashTag).toHaveBeenCalledTimes(3)
      })
    })

    describe('最後のページの場合', () => {
      beforeAll(() => {
        const getNotesFromHashTagSpied = jest.spyOn(noteModule, 'getNotesFromHashTag')
        getNotesFromHashTagSpied.mockImplementation((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: lastPageRes,
          })
        })
      })

      it('再起処理は行われず処理が正常に終了', async () => {
        await crawling(HASH_TAG)

        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 1')
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.noNotesError)
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(
          requestText.startCrawling,
          'Hashtag : ビジネス書評',
          'Page : 2',
        )
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(
          requestText.startCrawling,
          'Hashtag : ビジネス書評',
          'Page : 3',
        )
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.successCrawling)
        expect(consoleErrorSpied).not.toHaveBeenCalledWith(requestText.noteKeysError)
        expect(noteModule.getNotesFromHashTag).toHaveBeenCalledTimes(1)
      })
    })

    describe('エラーステータスが返る', () => {
      beforeAll(() => {
        const getNotesFromHashTagSpied = jest.spyOn(noteModule, 'getNotesFromHashTag')
        getNotesFromHashTagSpied.mockImplementation((hashtag: HashTags, page: number) => {
          return Promise.resolve({
            url: `https://note.com/api/v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`,
            res: errorRes,
          })
        })
      })

      it('エラー処理を行いクローラが停止', async () => {
        await expect(crawling(HASH_TAG)).rejects.toThrow(requestText.stopCrawling)

        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Hashtag : ビジネス書評', 'Page : 1')
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.noNotesError)
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(
          requestText.startCrawling,
          'Hashtag : ビジネス書評',
          'Page : 2',
        )
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(
          requestText.startCrawling,
          'Hashtag : ビジネス書評',
          'Page : 3',
        )
        expect(consoleErrorSpied).toHaveBeenCalledWith(requestText.noteKeysError)
        expect(consoleErrorSpied).toHaveBeenCalledWith('error occurred')
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.successCrawling)
        expect(noteModule.getNotesFromHashTag).toHaveBeenCalledTimes(1)
      })
    })
  })
})
