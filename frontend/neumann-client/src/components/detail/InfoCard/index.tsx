import AmazonIcon from '@/components/common/icon/AamazonIcon'
import CalendarIcon from '@/components/common/icon/CalendarIcon'
import CompanyIcon from '@/components/common/icon/CompanyIcon'
import HurtIcon from '@/components/common/icon/HurtIcon'
import OcticonGraphIcon from '@/components/common/icon/OcticonGraphIcon'
import PageIcon from '@/components/common/icon/PageIcon'
import XIcon from '@/components/common/icon/XIcon'
import { BookDetail } from '@/types/book'
import LikeButton from './LikeButton'

type InfoCardProps = {
  id: BookDetail['id']
  associate_url: BookDetail['associate_url']
  score: BookDetail['score']
  likes: BookDetail['likes']
  page: BookDetail['page']
  launched: BookDetail['launched']
  publisher: BookDetail['publisher']
}

export default function InfoCard({ id, associate_url, score, likes, page, launched, publisher }: InfoCardProps) {
  const ICON_SIZE = 16
  const X_SHARE_URL = `https://twitter.com/intent/tweet?hashtags=BizRank&url=${'#'}&related=BizRank`

  return (
    <div className='h-96 w-64 sub-bg-color rounded-lg p-6 space-y-8'>
      <div className='w-52 mx-auto'>
        <a
          className='block text-center py-1 w-full h-8 bg-primary sub-text-color rounded-lg mb-3 hover:bg-opacity-70'
          href={associate_url}
        >
          <div className='flex justify-center items-center'>
            <div className='mr-2'>
              <AmazonIcon width={18} height={18} />
            </div>
            <div>
              <span className='text-xs mr-1'>¥</span>
              1,540
            </div>
          </div>
        </a>
        <p className='text-gray-500 text-xs'>
          広告収益の10%は本のプレゼントキャンペーンに当て、
          <br />
          クリックして下さるユーザに還元できるように努めます。
        </p>
      </div>
      <div className='flex items-center justify-between'>
        <ul className='w-full text-xs space-y-3'>
          <li className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <OcticonGraphIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              評価ポイント
            </div>
            <div>{score}</div>
          </li>
          <li className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <HurtIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              総いいね数
            </div>
            <div>{likes}</div>
          </li>
          <li className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <PageIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              ページ数
            </div>
            <div>{page}</div>
          </li>
          <li className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <CalendarIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              発売日
            </div>
            <time>{new Date(launched).toLocaleDateString('ja-JP')}</time>
          </li>
          <li className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <CompanyIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              出版社
            </div>
            <div>{publisher}</div>
          </li>
        </ul>
      </div>
      <div className='flex justify-between'>
        <LikeButton id={id} likes={likes} />
        <div>
          <a
            className='flex justify-center items-center py-1 text-xs w-28 h-8 border border-gray-900 dark:border-gray-50 rounded-lg hover:opacity-70'
            href={X_SHARE_URL}
          >
            <span className='mr-1'>
              <XIcon width={ICON_SIZE} height={ICON_SIZE} />
            </span>
            コメントする
          </a>
        </div>
      </div>
    </div>
  )
}
