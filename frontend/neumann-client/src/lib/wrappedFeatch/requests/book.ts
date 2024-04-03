import * as fetch from '@/lib/wrappedFeatch'
import { Book, BookDetail } from '@/types/book'

type ResponseBooks = {
  books: Book[]
  rankings: number[]
  pages: {
    prev: number
    next: number
    last: number
  }
}

type ResponseBook = BookDetail

type PageParams = { page: number }

const FOUR_HOURS = 14400

export async function getBooks(page = 1) {
  return await fetch.get<ResponseBooks, PageParams>('/api/v1/books/', {
    params: { page },
    credentials: 'include',
    revalidate: FOUR_HOURS,
  })
}

export async function getBook(id: string) {
  return await fetch.get<ResponseBook>(`/api/v1/books/${id}`, {
    credentials: 'include',
    revalidate: FOUR_HOURS,
  })
}
