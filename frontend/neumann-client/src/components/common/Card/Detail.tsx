import { Book } from '@/types/book'
import { textEllipsis } from '@/utils/textEllipsis'
import Image from 'next/image'
import Likes from './Likes'

type DetailProps = {
  title: Book['title']
  imgUrl: Book['img_url']
  likes: Book['likes_count']
}

export default function Detail({ title, imgUrl, likes }: DetailProps) {
  const DISPLAY_WORDS = 50

  return (
    <>
      <div className='relative'>
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
          priority
        />
        <Likes likes={likes} />
      </div>
      <p className='text-xs text-gray-500'>{textEllipsis(title, DISPLAY_WORDS)}</p>
    </>
  )
}
