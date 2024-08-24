import Card from '@/components/common/Card'
import { ResponseBooks } from '@/lib/wrappedFeatch/requests/book'
import { Book } from '@/types/book'
import Link from 'next/link'

type BooksProps = {
  books: Book[]
  rankings?: ResponseBooks['rankings']
}

export default function Books({ books, rankings }: BooksProps) {
  return (
    <div className='lg:max-w-5xl md:max-w-[656px] sm:max-w-[424px]'>
      <ul className='sm:flex sm:flex-wrap lg:gap-12 sm:gap-10 mx-auto lg:mb-24 md:mb-16 mb-8'>
        {books.map((book, index) => (
          <li key={book.id.toString()} className='sm:mb-0 mb-8 flex justify-center items-center'>
            <Link href={`/books/${book.id}`}>
              {rankings ? (
                <Card title={book.title} img_url={book.img_url} ranking={rankings[index]} likes={book.likes_count} />
              ) : (
                <Card title={book.title} img_url={book.img_url} likes={book.likes_count} />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
