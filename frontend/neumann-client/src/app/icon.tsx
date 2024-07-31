import BizRankIcon from '@/components/common/icon/BizRankIcon'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(<BizRankIcon width={32} height={32} />, {
    ...size,
  })
}
