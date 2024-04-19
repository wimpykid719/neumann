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
        <Pagination page={INITIAL_PAGE} lastPage={res.pages.last} siblingCount={2} />
      </div>
    </section>
  )
}
