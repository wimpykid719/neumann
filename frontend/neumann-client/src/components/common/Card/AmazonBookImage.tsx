import { Book } from '@/types/book'
import Image from 'next/image'

type AmazonBookImageProps = {
  title: Book['title']
  imgUrl: Book['img_url']
}

export default function AmazonBookImage({ title, imgUrl }: AmazonBookImageProps) {
  return (
    <Image
      width={112}
      height={176}
      src={imgUrl}
      alt={`${title}の画像`}
      sizes='
        50vw,
        (min-width: 768px) 33vw,
        (min-width: 1024px) 25vw,
        (min-width: 1280px) 20vw
      '
      className='rounded-lg object-cover mb-2 w-28 h-44'
      placeholder='blur'
      blurDataURL='data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPMLmr4DwAFCwJel48AAwAAAABJRU5ErkJggg=='
      priority
    />
  )
}
