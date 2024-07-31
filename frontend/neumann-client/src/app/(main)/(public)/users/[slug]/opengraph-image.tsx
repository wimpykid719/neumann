import DefaultOGP from '@/components/ogp/DefaultOGP'
import ProfileOGP from '@/components/ogp/ProfileOGP'
import { ogp } from '@/lib/ImageResponse/ogp'
import { FetchError } from '@/lib/errors'
import { getUserProfile } from '@/lib/wrappedFeatch/requests/profile'
import app from '@/text/app.json'
import { SlugProps } from '@/types/slug'
import { cache } from 'react'

export const alt = `ユーザープロフィール | ${app.title} - OGP画像`
export const size = {
  width: 1200,
  height: 840,
}
export const contentType = 'image/png'

const getUserProfileMemoized = cache(getUserProfile)

export default async function Image({ params }: SlugProps) {
  const res = await getUserProfileMemoized(params.slug)

  if (res instanceof FetchError) return ogp(<DefaultOGP />, size)

  return ogp(
    <ProfileOGP
      name={res.name}
      bio={res.bio}
      xTwitter={res.x_twitter}
      instagram={res.instagram}
      facebook={res.facebook}
      linkedin={res.linkedin}
      tiktok={res.tiktok}
      youtube={res.youtube}
      website={res.website}
      avatar={res.avatar}
    />,
    size,
  )
}
