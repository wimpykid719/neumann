import Pagination from '@/components/common/Pagination'
import { FetchError } from '@/lib/errors'
import { getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'
import { FIRST_PAGE } from '@/utils/page'
import { range } from '@/utils/range'

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
      <Pagination page={page} lastPage={res.pages.last} siblingCount={2} />
    </>
  )
}
