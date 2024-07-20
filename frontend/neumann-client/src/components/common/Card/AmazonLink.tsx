import { Book, BookDetail } from '@/types/book'
import { SUPPLEMENT_TEXT_SIZE } from '@/utils/constant'
import Image from 'next/image'

type AmazonLinkProps = {
  title: Book['title']
  imgUrl: Book['img_url']
  associateUrl: BookDetail['associate_url']
}

export default function AmazonLink({ title, imgUrl, associateUrl }: AmazonLinkProps) {
  return (
    <>
      <div className='relative'>
        <a href={associateUrl} target='_blank' rel='noreferrer'>
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
        </a>
      </div>
      <p className={`text-[${SUPPLEMENT_TEXT_SIZE}] text-gray-500 mt-1`}>Amazonで購入する</p>
    </>
  )
}
