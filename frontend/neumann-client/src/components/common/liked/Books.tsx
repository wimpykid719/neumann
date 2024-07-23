import Card from '@/components/common/Card'
import { Book } from '@/types/book'
import Link from 'next/link'

type BooksProps = {
  books: Book[]
}

export default function Books({ books }: BooksProps) {
  return (
    <div className='lg:max-w-5xl md:max-w-[656px] sm:max-w-[424px] mx-auto'>
      <ul className='sm:flex sm:flex-wrap lg:gap-12 sm:gap-10'>
        {books.map(book => (
          <li key={book.id.toString()} className='sm:mb-0 mb-8 flex justify-center items-center'>
            <Link href={`/books/${book.id}`}>
              <Card title={book.title} img_url={book.img_url} likes={book.likes_count} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
