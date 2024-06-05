import * as fetch from '@/lib/wrappedFeatch'
import type { HashTags } from '@/utils/hashTags'

type Note = {
  key: string
}

type Notes = {
  data: {
    count: number
    is_last_page: boolean
    next_page: number | null
    notes: Note[] // 20件記事の詳細情報と著者の詳細情報が入る
  }
}

type ResponseNotes = Notes

const API = 'https://note.com/api/'

export async function getNotesFromHashTag(hashtag: HashTags, page: number) {
  const url = `${API}v3/hashtags/${hashtag}/notes?order=trend&page=${page}&paid_only=false`

  return {
    url,
    res: await fetch.get<ResponseNotes>(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }),
  }
}
