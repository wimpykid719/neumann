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
import { getUserNames } from '@/lib/wrappedFeatch/requests/user'
import error from '@/text/error.json'
import { FIRST_PAGE } from '@/utils/page'
import {
  facebookAccountURL,
  instagramAccountURL,
  linkedinAccountURL,
  tiktokAccountURL,
  xTwitterAccountURL,
  youtubeAccountURL,
} from '@/utils/profileURL'
import { range } from '@/utils/range'

type SlugsProps = {
  slug: string
}

export const generateStaticParams = async () => {
  const getUserSlugs = async (page: number) => {
    const res = await getUserNames(page)
    if (res instanceof FetchError) {
      throw error.failedUserNamesFetch
    }

    return res.user_names.map(user => user.name)
  }

  const res = await getUserNames()

  if (res instanceof FetchError) {
    throw error.failedBooksFetch
  }

  const pages = range(FIRST_PAGE, res.pages.last).map(num => num)
  const allUserIds = await (async pages => {
    return await Promise.all(
      pages.map(async page => {
        return getUserSlugs(page)
      }),
    )
  })(pages)

  return allUserIds.reduce((slugs: SlugsProps[], pageUserNames) => {
    if (pageUserNames) {
      return [...slugs, ...pageUserNames.map(userName => ({ slug: userName }))]
    }
    return slugs
  }, [])
}

export default async function ProfileLayout({ children, params }: { children: React.ReactNode; params: SlugsProps }) {
  const ICON_SIZE = 18
  const res = await getUserProfile(params.slug)

  if (res instanceof FetchError) {
    console.error(error.failedUserProfileFetch)
    return
  }

  return (
    <section className='space-y-8'>
      <div className='flex flex-wrap space-x-4'>
        <div className='w-16 h-16 rounded-lg py-6 shadow sub-bg-color text-xs font-medium text-center dark:border dark:border-gray-600'>
          (,,0‸0,,)
        </div>
        <div className='max-w-80 space-y-4'>
          <h2 className='font-bold'>{res.name}</h2>
          <p className='text-gray-500 whitespace-pre-wrap'>{res.bio}</p>
          <div>
            <ul className='flex flex-wrap'>
              {res.x_twitter && (
                <li className='w-8 h-8 rounded hover:item-bg-color'>
                  <a
                    className='flex w-full h-full justify-center items-center'
                    href={xTwitterAccountURL(res.x_twitter)}
                  >
                    <XIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.instagram && (
                <li className='w-8 h-8 rounded hover:item-bg-color'>
                  <a
                    className='flex w-full h-full justify-center items-center'
                    href={instagramAccountURL(res.instagram)}
                  >
                    <InstagramIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.linkedin && (
                <li className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={linkedinAccountURL(res.linkedin)}>
                    <LinkedInIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.facebook && (
                <li className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={facebookAccountURL(res.facebook)}>
                    <FacebookIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.tiktok && (
                <li className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={tiktokAccountURL(res.tiktok)}>
                    <TikTokIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.youtube && (
                <li className='w-8 h-8 rounded hover:item-bg-color'>
                  <a className='flex w-full h-full justify-center items-center' href={youtubeAccountURL(res.youtube)}>
                    <YouTubeIcon width={ICON_SIZE} height={ICON_SIZE} />
                  </a>
                </li>
              )}
              {res.website && (
                <li className='w-8 h-8 rounded hover:item-bg-color'>
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
