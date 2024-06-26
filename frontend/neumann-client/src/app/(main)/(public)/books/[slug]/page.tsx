import Card from '@/components/common/Card'
import Tabs from '@/components/common/Tabs'
import { bookNavigation } from '@/components/common/Tabs/Navigations'
import InfoCard from '@/components/detail/InfoCard'
import { FetchError } from '@/lib/errors'
import { getBook, getBooks } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'
import { FIRST_PAGE } from '@/utils/page'
import { range } from '@/utils/range'
import { replaceNewlines } from '@/utils/replaceNewlines'

type SlugsProps = {
  slug: string
}

export const generateStaticParams = async () => {
  const getBooksSlugs = async (page: number) => {
    const res = await getBooks(page)
    if (res instanceof FetchError) {
      throw error.failedBooksFetch
    }

    return res.books.map(book => book.id)
  }

  const res = await getBooks()

  if (res instanceof FetchError) {
    throw error.failedBooksFetch
  }

  const pages = range(FIRST_PAGE, res.pages.last).map(num => num)
  const allBookIds = await (async pages => {
    return await Promise.all(
      pages.map(async page => {
        return getBooksSlugs(page)
      }),
    )
  })(pages)

  return allBookIds.reduce((slugs: SlugsProps[], pageBookIds) => {
    if (pageBookIds) {
      return [...slugs, ...pageBookIds.map(id => ({ slug: id.toString() }))]
    }
    return slugs
  }, [])
}

export default async function Detail({ params }: { params: SlugsProps }) {
  const res = await getBook(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedBookFetch)
    return
  }

  return (
    <section className='space-y-8'>
      <Tabs navigation={bookNavigation} />
      <div className='flex lg:flex-row flex-col lg:flex-wrap lg:gap-7 lg:space-y-0 space-y-6 justify-center lg:items-start items-center'>
        <Card title={res.title} img_url={res.img_url} ranking={res.ranking} likes={res.likes_count} detail={false} />
        <div className='space-y-8 flex-1'>
          <h2 className='font-bold text-lg'>{res.title}</h2>
          <article className='whitespace-pre-wrap'>{replaceNewlines(res.description)}</article>
        </div>
        <InfoCard
          id={res.id}
          associate_url={res.associate_url}
          price={res.price_delimited}
          score={res.score}
          likes={res.likes_count}
          page={res.page}
          launched={res.launched}
          publisher={res.publisher}
        />
      </div>
    </section>
  )
}
