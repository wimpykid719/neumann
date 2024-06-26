export type Book = {
  id: number
  title: string
  img_url: string
  likes_count: number
}

export type BookDetail = Book & {
  description: string
  price_delimited: string
  score: number
  page: number
  launched: string
  author: string
  publisher: string
  associate_url: string
  ranking: number
}
