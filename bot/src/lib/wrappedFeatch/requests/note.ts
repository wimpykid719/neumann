import * as fetch from '@/lib/wrappedFeatch'
import type { HashTags } from '@/utils/hashTags'

export type Note = {
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

export type EmbeddedContents = {
  url: string
}

type HashtagNotes = {
  hashtag: {
    name: string
  }
}

export type NoteDetail = {
  data: {
    name: string
    user: {
      user_profile_image_path: string
      following_count: number
      follower_count: number
    }
    like_count: number
    hashtag_notes: HashtagNotes[]
    embedded_contents: EmbeddedContents[]
    publish_at: string
    note_url: string
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

export async function getNoteDetail(key: Note['key']) {
  const url = `${API}v3/notes/${key}`

  return {
    url,
    key,
    res: await fetch.get<NoteDetail>(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }),
  }
}
