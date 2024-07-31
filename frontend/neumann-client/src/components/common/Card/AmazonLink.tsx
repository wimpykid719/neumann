import { Book, BookDetail } from '@/types/book'
import { SUPPLEMENT_TEXT_SIZE } from '@/utils/constant'
import AmazonBookImage from './AmazonBookImage'

type AmazonLinkProps = {
  title: Book['title']
  imgUrl: Book['img_url']
  associateUrl: BookDetail['associate_url']
}

export default function AmazonLink({ title, imgUrl, associateUrl }: AmazonLinkProps) {
  return (
    <>
      <div className='relative'>
        <a href={associateUrl} target='_blank' rel='sponsored'>
          <AmazonBookImage title={title} imgUrl={imgUrl} />
        </a>
      </div>
      <p className={`text-[${SUPPLEMENT_TEXT_SIZE}] text-gray-500 mt-1`}>Amazonで購入する</p>
    </>
  )
}
