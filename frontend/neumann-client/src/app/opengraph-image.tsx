import DefaultOGP from '@/components/ogp/DefaultOGP'
import { ogp } from '@/lib/ImageResponse/ogp'
import app from '@/text/app.json'

export const revalidate = 'force-cache'
export const alt = `${app.title} - OGP画像`
export const size = {
  width: 1200,
  height: 840,
}
export const contentType = 'image/png'

export default async function Image() {
  return ogp(<DefaultOGP />, size)
}
