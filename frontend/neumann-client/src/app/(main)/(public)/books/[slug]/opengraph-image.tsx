import BookOGP from '@/components/ogp/BookOGP'
import DefaultOGP from '@/components/ogp/DefaultOGP'
import { ogp } from '@/lib/ImageResponse/ogp'
import { FetchError } from '@/lib/errors'
import { getBook } from '@/lib/wrappedFeatch/requests/book'
import app from '@/text/app.json'
import { SlugProps } from '@/types/slug'
import { cache } from 'react'

export const alt = `書籍詳細 | ${app.title} - OGP画像`
export const size = {
  width: 1200,
  height: 840,
}
export const contentType = 'image/png'

const getBookMemoized = cache(getBook)

export default async function Image({ params }: SlugProps) {
  const res = await getBookMemoized(params.slug)

  if (res instanceof FetchError) return ogp(<DefaultOGP />, size)

  return ogp(<BookOGP title={res.title} imgUrl={res.img_url} likesCount={res.likes_count} />, size)
}
