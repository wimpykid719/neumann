import Card from '@/components/common/Card'
import Pagination from '@/components/common/Pagination'
import Tabs from '@/components/common/Tabs'
import { booksNavigation } from '@/components/common/Tabs/Navigations'
import { FetchError } from '@/lib/errors'
import { failedPageMetadata } from '@/lib/metadata'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import app from '@/text/app.json'
import error from '@/text/error.json'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getBooksMemoized = cache(getBooks)

type PathProps = {
  params: {
    page: string
  }
}

export async function generateMetadata({ params }: PathProps): Promise<Metadata> {
  const page = Number(params.page)
  const res = await getBooksMemoized(page)
  if (res instanceof FetchError) {
    console.error(error.failedBooksFetch)
    return failedPageMetadata()
  }

  return {
    title: `${app.title} | ${params.page}ページ目`,
  }
}

export default async function Index({ params }: PathProps) {
  const page = Number(params.page)
  const res = await getBooksMemoized(page)

  if (res instanceof FetchError) {
    console.error(error.failedBooksFetch)
    notFound()
  }

  return (
    <section className='space-y-8'>
      <div className='space-y-8'>
        <Tabs navigation={booksNavigation} />
        <div className='lg:max-w-5xl md:max-w-[656px] sm:max-w-[424px] mx-auto min-h-screen'>
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
          <Pagination page={page} lastPage={res.pages.last} siblingCount={2} />
        </div>
      </div>
    </section>
  )
}
