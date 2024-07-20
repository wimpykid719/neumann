import Card from '@/components/common/Card'
import Tabs from '@/components/common/Tabs'
import { bookNavigation } from '@/components/common/Tabs/Navigations'
import Hashtags from '@/components/detail/Hashtags'
import InfoCard from '@/components/detail/InfoCard'
import NoteReference from '@/components/detail/NoteReference'
import { FetchError } from '@/lib/errors'
import { getBook } from '@/lib/wrappedFeatch/requests/book'
import error from '@/text/error.json'

type SlugProps = {
  slug: string
}

export default async function Detail({ params }: { params: SlugProps }) {
  const res = await getBook(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedBookFetch)
    return
  }

  return (
    <section className='space-y-8'>
      <Tabs navigation={bookNavigation} />
      <div className='flex lg:flex-row flex-col lg:flex-wrap lg:gap-7 lg:space-y-0 space-y-6 justify-center lg:items-start items-center'>
        <Card
          title={res.title}
          img_url={res.img_url}
          ranking={res.ranking}
          likes={res.likes_count}
          associateUrl={res.associate_url}
        />
        <div className='space-y-8 flex-1'>
          <h2 className='font-bold text-lg'>{res.title}</h2>
          <Hashtags hashtags={res.note_reference.hashtags} />
          <NoteReference referenceObjs={res.note_reference.reference_objs} />
        </div>
        <InfoCard
          id={res.id}
          associate_url={res.associate_url}
          price={res.price_delimited}
          score={res.round_score}
          likes={res.likes_count}
          page={res.page}
          launched={res.launched}
          publisher={res.publisher}
          scrapedAt={res.scraped_at}
        />
      </div>
    </section>
  )
}
