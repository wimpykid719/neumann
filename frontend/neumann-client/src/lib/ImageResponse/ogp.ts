import fs from 'fs'
import path from 'path'
import { ImageResponse } from 'next/og'

type Size = {
  width: number
  height: number
}

const inter = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'))
const interBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'))

export const ogp = (ogpComponent: JSX.Element, size: Size) => {
  return new ImageResponse(ogpComponent, {
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
