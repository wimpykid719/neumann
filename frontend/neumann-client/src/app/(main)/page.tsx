import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import Pagination, { INITIAL_PAGE } from '@/components/common/Pagination'
import Tabs from '@/components/common/Tabs'
import { booksNavigation } from '@/components/common/Tabs/Navigations'
import Books from '@/components/profile/liked/Books'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'
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
          <Books books={res.books} rankings={res.rankings} />
          <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
        </div>
      </div>
      <Footer />
    </section>
  )
}
