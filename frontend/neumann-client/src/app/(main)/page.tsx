import Card from '@/components/common/Card'
import Pagination, { INITIAL_PAGE } from '@/components/common/Pagination'
import Tabs from '@/components/common/Tabs'
import { booksNavigation } from '@/components/common/Tabs/Navigations'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'
import Link from 'next/link'

export default async function Home() {
  const res = await getBooks()

  if (res instanceof FetchError) return <p>{error.failedBooksFetch}</p>

  return (
    <section className='flex flex-col min-h-screen items-center justify-between space-y-8'>
      <div className='w-full space-y-8'>
        <Tabs navigation={booksNavigation} />
        <div className='lg:max-w-5xl md:max-w-2xl m-auto'>
          <ul className='flex flex-wrap sm:justify-normal justify-center lg:gap-12 md:gap-8 sm:gap-2'>
            {res.books.map((book, index) => (
              <li key={book.id.toString()} className='sm:mb-0 mb-8'>
                <Link href={`books/${book.id}`}>
                  <Card title={book.title} img_url={book.img_url} ranking={res.rankings[index]} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='w-full'>
        <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
