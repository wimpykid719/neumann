import Tabs from '@/components/common/Tabs'
import { profileNavigation } from '@/components/common/Tabs/Navigations'
import FacebookIcon from '@/components/common/icon/FacebookIcon'
import InstagramIcon from '@/components/common/icon/InstagramIcon'
import LinkedInIcon from '@/components/common/icon/LinkedInIcon'
import TikTokIcon from '@/components/common/icon/TikTokIcon'
import URLIcon from '@/components/common/icon/URLIcon'
import XIcon from '@/components/common/icon/XIcon'
import YouTubeIcon from '@/components/common/icon/YouTubeIcon'
import { FetchError } from '@/lib/errors'
import { getUserProfile } from '@/lib/wrappedFeatch/requests/profile'
import app from '@/text/app.json'
import error from '@/text/error.json'
import {
  facebookAccountURL,
  instagramAccountURL,
  linkedinAccountURL,
  tiktokAccountURL,
  xTwitterAccountURL,
  youtubeAccountURL,
} from '@/utils/profileURL'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getUserProfileMemoized = cache(getUserProfile)

type SlugProps = {
  slug: string
}

export async function generateMetadata({ params }: { params: SlugProps }): Promise<Metadata> {
  const res = await getUserProfileMemoized(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedProfileFetchMetadata)
    return {
      title: app.title,
    }
  }

  return {
    title: `${res.name} | ${app.title}`,
  }
}

export default async function ProfileLayout({ children, params }: { children: React.ReactNode; params: SlugProps }) {
  const ICON_SIZE = 18
  const res = await getUserProfileMemoized(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedUserProfileFetch)
    notFound()
  }

  return (
    <section className='space-y-8'>
      <div className='md:flex  md:space-x-4 md:space-y-0 space-y-4'>
        <div
          className='
            w-16 h-16
            flex justify-center
            items-center rounded-lg
            shadow sub-bg-color text-xs
            font-medium text-center
            dark:border dark:border-gray-600
            overflow-hidden relative
          '
        >
          {res.avatar ? (
            <Image
              src={res.avatar}
              alt={`${res.name}のプロフィール画像`}
              sizes='
                        50vw,
                        (min-width: 768px) 33vw,
                        (min-width: 1024px) 25vw,
                        (min-width: 1280px) 20vw
                      '
              fill={true}
              className='absolute object-cover'
            />
          ) : (
            '(,,0‸0,,)'
          )}
        </div>
        <div className='max-w-80 space-y-2'>
          <h2 className='font-bold'>{res.name}</h2>
          <p className='text-gray-500 whitespace-pre-wrap'>{res.bio}</p>
          <div>
            <ul className='flex flex-wrap'>
              {res.x_twitter && (
                <li key='x' className='w-8 h-8 rounded hover:item-bg-color'>
                  <a
                    className='flex w-full h-full justify-center items-center'
                    href={xTwitterAccountURL(res.x_twitter)}
                  >
                    <XIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.instagram && (
                <li key='instagram' className='w-8 h-8 rounded hover:item-bg-color'>
                  <a
                    className='flex w-full h-full justify-center items-center'
                    href={instagramAccountURL(res.instagram)}
                  >
                    <InstagramIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.linkedin && (
                <li key='linkedin' className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={linkedinAccountURL(res.linkedin)}>
                    <LinkedInIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.facebook && (
                <li key='facebook' className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={facebookAccountURL(res.facebook)}>
                    <FacebookIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.tiktok && (
                <li key='tiktok' className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={tiktokAccountURL(res.tiktok)}>
                    <TikTokIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.youtube && (
                <li key='youtube' className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={youtubeAccountURL(res.youtube)}>
                    <YouTubeIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.website && (
                <li key='website' className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={res.website}>
                    <URLIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Tabs navigation={profileNavigation} />
      {children}
    </section>
  )
}
