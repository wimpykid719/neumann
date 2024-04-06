import * as fetch from '@/lib/wrappedFeatch'
import { AccessToken } from '@/types/accessToken'
import { BookDetail } from '@/types/book'

type BookLikeData = {
  id: BookDetail['id']
}

type Response = {
  liked: boolean
}

type BookLikeParams = {
  book: {
    id: BookLikeData['id']
  }
}

export async function getLike(bookId: BookDetail['id'], accessToken: AccessToken) {
  return await fetch.get<Response>(`/api/v1/likes/${bookId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
}

export async function postLike(bookLikeData: BookLikeData, accessToken: AccessToken) {
  const params = { book: bookLikeData }
  return await fetch.post<BookLikeParams, Response>('/api/v1/likes', params, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
}

export async function deleteLike(bookLikeData: BookLikeData, accessToken: AccessToken) {
  return await fetch.destroy<Response>(`/api/v1/likes/${bookLikeData.id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
}
