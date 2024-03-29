import Pagination from '@/components/common/Pagination'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'

export default async function Home() {
  const INITIAL_PAGE = 1
  const res = await getBooks()

  if (res instanceof FetchError) return <p>{error.failedBooksFetch}</p>

  return (
    <>
      <section className='flex min-h-screen flex-col items-center justify-between p-24'>
        <div>
          <ul>
            {res.books.map(book => (
              <li key={book.id}>{book.title}</li>
            ))}
          </ul>
        </div>
      </section>
      <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
    </>
  )
}
