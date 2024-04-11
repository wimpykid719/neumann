import { Book } from '@/types/book'
import { textEllipsis } from '@/utils/textEllipsis'
import Image from 'next/image'
import Likes from './Likes'

type CardProps = {
  title: Book['title']
  img_url: Book['img_url']
  ranking?: number
  detail?: boolean
}

export default function Card({ title, img_url, ranking, detail = true }: CardProps) {
  const DISPLAY_WORDS = 50

  return (
    <div
      className={`w-48 ${detail ? 'h-72' : 'h-64'} sub-bg-color rounded-lg p-2 ${
        !ranking && 'flex flex-col justify-center items-center'
      }`}
    >
      {ranking && (
        <div>
          <span
            className={`
            inline-block h-5 ${ranking < 100 ? 'w-5' : 'px-1'}
            text-center leading-5 text-xs text-gray-500
            rounded-full main-bg-color
            dark:border dark:border-gray-800
            mb-2
          `}
          >
            {ranking}
          </span>
        </div>
      )}
      <div className='flex flex-col items-center justify-between'>
        <div className='relative'>
          <Image
            width={112}
            height={176}
            src={img_url}
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
          {detail && <Likes likes={120} />}
        </div>
        {detail && <p className='text-xs text-gray-500'>{textEllipsis(title, DISPLAY_WORDS)}</p>}
      </div>
    </div>
  )
}
