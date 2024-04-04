import Card from '@/components/common/Card'
import Pagination from '@/components/common/Pagination'
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
    console.error(error.failedBooksFetch)
    return
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
    <section className='flex min-h-screen flex-col items-center justify-between space-y-8'>
      <div className='w-full'>
        <ul className='flex flex-wrap gap-12 w-full'>
          {res.books.map((book, index) => (
            <Link key={book.id.toString()} href={`books/${book.id}`}>
              <Card title={book.title} img_url={book.img_url} ranking={res.rankings[index]} />
            </Link>
          ))}
        </ul>
      </div>
      <div className='w-full'>
        <Pagination page={page} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
