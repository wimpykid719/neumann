import Card from '@/components/common/Card'
import Pagination from '@/components/common/Pagination'
import Tabs from '@/components/common/Tabs'
import { booksNavigation } from '@/components/common/Tabs/Navigations'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'
import { FIRST_PAGE } from '@/utils/page'
import { range } from '@/utils/range'
import Link from 'next/link'

type PathsProps = {
  params: {
    page: string
  }
}

export const generateStaticParams = async () => {
  const res = await getBooks()

  if (res instanceof FetchError) {
    throw error.failedBooksFetch
  }

  const paths = range(FIRST_PAGE, res.pages.last).map(num => ({
    page: `${num}`, //stringにしなければいけない
  }))
  return paths
}

export default async function Index({ params }: PathsProps) {
  const page = Number(params.page)
  const res = await getBooks(page)

  if (res instanceof FetchError) return <p>{error.failedBooksFetch}</p>

  return (
    <section className='space-y-8'>
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
          <Pagination page={page} lastPage={res.pages.last} siblingCount={2} />
        </div>
      </div>
    </section>
  )
}
