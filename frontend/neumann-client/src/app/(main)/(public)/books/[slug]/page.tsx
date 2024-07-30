import Card from '@/components/common/Card'
import Tabs from '@/components/common/Tabs'
import { bookNavigation } from '@/components/common/Tabs/Navigations'
import Hashtags from '@/components/detail/Hashtags'
import InfoCard from '@/components/detail/InfoCard'
import NoteReference from '@/components/detail/NoteReference'
import { FetchError } from '@/lib/errors'
import { getBook } from '@/lib/wrappedFeatch/requests/book'
import app from '@/text/app.json'
import error from '@/text/error.json'
import { SlugProps } from '@/types/slug'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getBookMemoized = cache(getBook)

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const res = await getBookMemoized(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedBooksFetchMetadata)
    return {
      title: app.title,
    }
  }

  return {
    title: `${res.title} | ${app.title}`,
  }
}

export default async function Detail({ params }: SlugProps) {
  const res = await getBookMemoized(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedBookFetch)
    notFound()
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
          author={res.author}
          publisher={res.publisher}
          scrapedAt={res.scraped_at}
        />
      </div>
    </section>
  )
}
