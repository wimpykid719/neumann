import Card from '@/components/common/Card'
import Pagination, { INITIAL_PAGE } from '@/components/common/Pagination'
import { FetchError } from '@/lib/errors'
import { getUserLikes } from '@/lib/wrappedFeatch/requests/user'
import error from '@/text/error.json'
import { FIRST_PAGE } from '@/utils/page'
import { range } from '@/utils/range'
import Link from 'next/link'

type SlugProps = {
  slug: string
}

type PageProps = {
  page: string
}

type UserLikesProps = SlugProps & PageProps

export const generateStaticParams = async ({ params }: { params: SlugProps }) => {
  const res = await getUserLikes(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedUserLikes)
    return
  }

  const paths = range(FIRST_PAGE, res.pages.last).map(num => ({
    page: `${num}`, //stringにしなければいけない
  }))
  return paths
}

export default async function UserLikesPage({ params }: { params: UserLikesProps }) {
  const { slug, page } = params
  const res = await getUserLikes(slug, Number(page))

  if (res instanceof FetchError) return <p>{error.failedUserLikes}</p>

  return (
    <section>
      <div>
        <ul className='flex flex-wrap gap-12 w-full'>
          {res.books.map(book => (
            <Link key={book.id.toString()} href={`/books/${book.id}`}>
              <Card title={book.title} img_url={book.img_url} />
            </Link>
          ))}
        </ul>
      </div>
      <div className='w-full'>
        <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
