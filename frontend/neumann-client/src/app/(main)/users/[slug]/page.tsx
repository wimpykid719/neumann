import Card from '@/components/common/Card'
import Pagination, { INITIAL_PAGE } from '@/components/common/Pagination'
import { FetchError } from '@/lib/errors'
import { getUserLikes } from '@/lib/wrappedFeatch/requests/user'
import error from '@/text/error.json'
import Link from 'next/link'

type SlugProps = {
  slug: string
}

export default async function UserLikesPage({ params }: { params: SlugProps }) {
  const res = await getUserLikes(params.slug)

  if (res instanceof FetchError) return <p>{error.failedUserLikes}</p>

  return (
    <section>
      <div>
        <ul className='flex flex-wrap gap-12 w-full'>
          {res.books.map(book => (
            <Link key={book.id.toString()} href={`/books/${book.id}`}>
              <Card title={book.title} img_url={book.img_url} likes={book.likes_count} />
            </Link>
          ))}
        </ul>
      </div>
      <div className='w-full'>
        <Pagination path={`${params.slug}/likes/`} page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
