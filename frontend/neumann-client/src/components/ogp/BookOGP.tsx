import Base from './templates/Base'
import Book, { BookProps } from './templates/Book'

export default function BookOGP({ title, imgUrl, likesCount }: BookProps) {
  return <Base contents={<Book title={title} imgUrl={imgUrl} likesCount={likesCount} />} />
}
