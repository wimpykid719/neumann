export type Book = {
  id: number
  title: string
  img_url: string
}

export type BookDetail = Book & {
  description: string
  score: number
  page: number
  launched: string
  author: string
  publisher: string
  associate_url: string
}
