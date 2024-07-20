import { Book } from '@/types/book'
import AmazonLink from './AmazonLink'
import Detail from './Detail'

type CardProps = {
  title: Book['title']
  img_url: Book['img_url']
  likes: Book['likes_count']
  ranking?: number
  associateUrl?: string
}

export default function Card({ title, img_url, ranking, likes, associateUrl }: CardProps) {
  return (
    <div
      className={`w-48 ${!associateUrl ? 'h-72' : 'h-64'} sub-bg-color rounded-lg p-2 ${
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
      <div className='flex flex-col items-center justify-between px-3'>
        {!associateUrl ? (
          <Detail title={title} imgUrl={img_url} likes={likes} />
        ) : (
          <AmazonLink title={title} imgUrl={img_url} associateUrl={associateUrl} />
        )}
      </div>
    </div>
  )
}
