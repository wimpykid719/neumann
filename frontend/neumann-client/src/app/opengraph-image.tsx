import fs from 'fs'
import path from 'path'
import DefaultOGP from '@/components/ogp/DefaultOGP'
import app from '@/text/app.json'
import { ImageResponse } from 'next/og'

export const alt = `${app.title} - OGP画像`
export const size = {
  width: 1200,
  height: 840,
}
export const contentType = 'image/png'

export default async function Image() {
  const inter = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'))
  const interBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'))

  return new ImageResponse(<DefaultOGP />, {
    ...size,
    fonts: [
      {
        name: 'Inter',
        data: interBold,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: inter,
        weight: 400,
        style: 'normal',
      },
    ],
  })
}
