import HeartIcon from '@/components/common/icon/HeartIcon'
import { BookDetail } from '@/types/book'
import Image from 'next/image'

type NoteReferenceProps = {
  referenceObjs: BookDetail['note_reference']['reference_objs']
}

export default function NoteReference({ referenceObjs }: NoteReferenceProps) {
  const ICON_SIZE = 16

  return (
    <div className='text-gray-500 space-y-2'>
      <ul className='space-y-4'>
        {referenceObjs.map(referenceObj => (
          <li key={referenceObj.title} className='text-sm'>
            <div className='flex space-x-2'>
              <a className='hover:opacity-70' href={referenceObj.url} target='_blank' rel='nofollow'>
                {referenceObj.title}
              </a>
              <Image
                width={24}
                height={24}
                src={referenceObj.userProfileImg}
                alt={'noteユーザプロフィールの画像'}
                sizes='
              50vw,
              (min-width: 768px) 33vw,
              (min-width: 1024px) 25vw,
              (min-width: 1280px) 20vw
            '
                className='rounded-full object-cover w-6 h-6 border-2 border-white shadow dark:border-gray-700'
              />
            </div>
            <div className='flex items-center space-x-1'>
              <span className='text-primary pt-1'>
                <HeartIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              <span>{referenceObj.likes}</span>
            </div>
          </li>
        ))}
      </ul>
      <span className='text-xs flex justify-end'>書籍が紹介されていた記事</span>
    </div>
  )
}
