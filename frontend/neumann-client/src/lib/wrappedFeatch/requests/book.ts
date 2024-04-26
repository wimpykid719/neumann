import * as fetch from '@/lib/wrappedFeatch'
import { Book, BookDetail } from '@/types/book'
import { PageParams, PagyMeta } from '@/types/pagy'

type ResponseBooks = {
  books: Book[]
  rankings: number[]
  pages: PagyMeta
}

type ResponseBook = BookDetail

const NO_CACHE_SSR = 0

export async function getBooks(page = 1) {
  return await fetch.get<ResponseBooks, PageParams>('/api/v1/books', {
    params: { page },
    revalidate: NO_CACHE_SSR,
  })
}

export async function getBook(id: string) {
  return await fetch.get<ResponseBook>(`/api/v1/books/${id}`, {
    revalidate: NO_CACHE_SSR,
  })
}
