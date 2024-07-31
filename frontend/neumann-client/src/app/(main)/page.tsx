import Card from '@/components/common/Card'
import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import Pagination, { INITIAL_PAGE } from '@/components/common/Pagination'
import Tabs from '@/components/common/Tabs'
import { booksNavigation } from '@/components/common/Tabs/Navigations'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function Home() {
  const res = await getBooks()

  if (res instanceof FetchError) return <p>{error.failedBooksFetch}</p>

  return (
    <section className='space-y-8'>
      <div className='m-auto w-full max-w-5xl space-y-8 md:px-14 px-8 pt-8'>
        <Suspense>
          <Header />
        </Suspense>
        <div className='space-y-8'>
          <Tabs navigation={booksNavigation} />
          <div className='lg:max-w-5xl md:max-w-[656px] sm:max-w-[424px] mx-auto'>
            <ul className='sm:flex sm:flex-wrap lg:gap-12 sm:gap-10 lg:mb-24 md:mb-16 mb-8'>
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
            <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}
