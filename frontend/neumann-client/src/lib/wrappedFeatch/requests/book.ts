import * as fetch from '@/lib/wrappedFeatch'
import { Book, BookDetail } from '@/types/book'

type ResponseBooks = {
  books: Book[]
  pages: {
    prev: number
    next: number
    last: number
  }
}

type ResponseBook = BookDetail

type PageParams = { page: number }

export async function getBooks(page = 1) {
  const ONE_DAY = 86400

  return await fetch.get<ResponseBooks, PageParams>('/api/v1/books/', {
    params: { page },
    credentials: 'include',
    revalidate: ONE_DAY,
  })
}

export async function getBook(id: number) {
  return await fetch.get<ResponseBook>(`/api/v1/book/${id}`, {
    credentials: 'include',
  })
}
