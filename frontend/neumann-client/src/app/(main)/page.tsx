import Card from '@/components/common/Card'
import Pagination, { INITIAL_PAGE } from '@/components/common/Pagination'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'
import Link from 'next/link'

export default async function Home() {
  const res = await getBooks()

  if (res instanceof FetchError) return <p>{error.failedBooksFetch}</p>

  return (
    <section className='w-full'>
      <div className='space-y-8 lg:mb-32 md:mb-16 mb-8'>
        <div className='lg:max-w-5xl md:max-w-[656px] sm:max-w-[424px] mx-auto'>
          <ul className='sm:flex sm:flex-wrap lg:gap-12 sm:gap-10'>
            {res.books.map((book, index) => (
              <li key={book.id.toString()} className='sm:mb-0 mb-8 flex justify-center items-center'>
                <Link href={`books/${book.id}`}>
                  <Card
                    title={book.title}
                    img_url={book.img_url}
                    ranking={res.rankings[index]}
                    likes={book.likes_count}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
