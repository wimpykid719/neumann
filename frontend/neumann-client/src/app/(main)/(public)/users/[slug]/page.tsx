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
    <section className='space-y-8'>
      <div className='lg:max-w-5xl md:max-w-[656px] sm:max-w-[424px] mx-auto'>
        <ul className='sm:flex sm:flex-wrap lg:gap-12 sm:gap-10'>
          {res.books.map(book => (
            <li key={book.id.toString()} className='sm:mb-0 mb-8 flex justify-center items-center'>
              <Link href={`/books/${book.id}`}>
                <Card title={book.title} img_url={book.img_url} likes={book.likes_count} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className='w-full'>
        <Pagination path={`${params.slug}/likes/`} page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
