type ReferenceObj = {
  url: string
  likes: number
  title: string
  userProfileImg: string
}

export type Book = {
  id: number
  title: string
  img_url: string
  likes_count: number
}

export type BookDetail = Book & {
  scraped_at: string
  price_delimited: string
  round_score: number
  page: number
  launched: string
  author: string
  publisher: string
  associate_url: string
  ranking: number
  note_reference: {
    hashtags: string[]
    reference_objs: ReferenceObj[]
  }
}
