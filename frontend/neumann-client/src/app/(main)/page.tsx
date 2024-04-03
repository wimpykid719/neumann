import Card from '@/components/common/Card'
import Pagination from '@/components/common/Pagination'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'

export default async function Home() {
  const INITIAL_PAGE = 1
  const res = await getBooks()

  if (res instanceof FetchError) return <p>{error.failedBooksFetch}</p>

  return (
    <section className='flex flex-col min-h-screen items-center justify-between space-y-8'>
      <div className='w-full'>
        <ul className='flex flex-wrap gap-12 w-full'>
          {res.books.map((book, index) => (
            <Card key={book.id.toString()} book={book} ranking={res.rankings[index]} />
          ))}
        </ul>
      </div>
      <div className='w-full'>
        <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
