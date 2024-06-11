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
  const noteDetail = {
    data: {
      name: 'タイトル',
      user: {
        user_profile_image_path: 'https://note.com/user/profile/path',
        following_count: 321,
        follower_count: 541,
      },
      like_count: 88,
      hashtag_notes: [{ hashtag: { name: '#ハッシュタグ - 1' } }, { hashtag: { name: '#ハッシュタグ - 2' } }],
      embedded_contents: [
        { url: 'https://amzn.to/3Kya66P' },
        { url: 'https://note.com/kankipublishing/n/n9a09777a03f' },
      ],
      publish_at: new Date().toDateString(),
      note_url: 'https://note.com/user/key',
    },
  }

  describe('再起処理', () => {
    const consoleInfoSpied = jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.spyOn(crawlingModuleForSpy, 'crawling')

    afterEach(() => {
      jest.clearAllMocks() // 各テストの後にモックをクリア
    })

    describe('keyが25個保存されている場合', () => {
      const getNoteDetailSpied = jest.spyOn(noteModule, 'getNoteDetail')
      getNoteDetailSpied.mockImplementation((key: Note['key']) => {
        return Promise.resolve({
          url: `https://note.com/api/v3/notes/${key}`,
          key,
          res: noteDetail,
        })
      })

      it('2回再起処理が行われる', async () => {
        await crawling()

        expect(consoleInfoSpied).toHaveBeenCalledWith(
          requestText.startCrawling,
          `Start from : ${requestText.initialPage}`,
        )
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.startCrawling, 'Start from : xxxxxxxx')
        expect(consoleInfoSpied).not.toHaveBeenCalledWith(requestText.noKeys)
        expect(consoleInfoSpied).toHaveBeenCalledWith(requestText.doneNoteCrawling)
        expect(consoleInfoSpied).toHaveBeenCalledWith(`${requestText.amazonUrl} : https://amzn.to/3Kya66P`)

        expect(noteModule.getNoteDetail).toHaveBeenCalledTimes(25)
        expect(crawling).toHaveBeenCalledTimes(2)
      })
    })
  })
})
