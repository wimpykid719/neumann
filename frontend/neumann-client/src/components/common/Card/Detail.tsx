import { Book } from '@/types/book'
import { textEllipsis } from '@/utils/textEllipsis'
import AmazonBookImage from './AmazonBookImage'
import Likes from './Likes'

type DetailProps = {
  title: Book['title']
  imgUrl: Book['img_url']
  likes: Book['likes_count']
}

export default function Detail({ title, imgUrl, likes }: DetailProps) {
  const DISPLAY_WORDS = 30

  return (
    <>
      <div className='relative'>
        <AmazonBookImage title={title} imgUrl={imgUrl} />
        <Likes likes={likes} />
      </div>
      <p className='text-xs text-gray-500'>{textEllipsis(title, DISPLAY_WORDS)}</p>
    </>
  )
}
