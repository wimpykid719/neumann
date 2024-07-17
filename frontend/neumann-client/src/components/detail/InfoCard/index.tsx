import CalendarIcon from '@/components/common/icon/CalendarIcon'
import CompanyIcon from '@/components/common/icon/CompanyIcon'
import HeartIcon from '@/components/common/icon/HeartIcon'
import OcticonGraphIcon from '@/components/common/icon/OcticonGraphIcon'
import PageIcon from '@/components/common/icon/PageIcon'
import XIcon from '@/components/common/icon/XIcon'
import { BookDetail } from '@/types/book'
import AssociateLink from './AssociateLink'
import LikeButton from './LikeButton'

type InfoCardProps = {
  id: BookDetail['id']
  associate_url: BookDetail['associate_url']
  price: BookDetail['price_delimited']
  score: BookDetail['round_score']
  likes: BookDetail['likes_count']
  page: BookDetail['page']
  launched: BookDetail['launched']
  publisher: BookDetail['publisher']
  scrapedAt: BookDetail['scraped_at']
}

export default function InfoCard({
  id,
  associate_url,
  price,
  score,
  likes,
  page,
  launched,
  publisher,
  scrapedAt,
}: InfoCardProps) {
  const ICON_SIZE = 16
  const X_SHARE_URL = `https://twitter.com/intent/tweet?hashtags=BizRank&url=${'#'}&related=BizRank`
  const SUPPLEMENT_TEXT_SIZE = '10px'

  const transformDateJaStyle = (date: string) => {
    const scrapedAt = new Date(date)
    const year = scrapedAt.getFullYear()
    // getMonthは 0~11 始まりで1ヶ月ずれるへの対応
    const month = scrapedAt.getMonth() + 1
    const day = scrapedAt.getDate()

    return year + '年' + month + '月' + day + '日'
  }

  return (
    <div className='w-64 sub-bg-color rounded-lg p-6 space-y-8'>
      <div className='w-52 mx-auto'>
        <AssociateLink price={price} associate_url={associate_url} />
        <p className='text-gray-500 text-xs'>
          広告収益の10%は本のプレゼントキャンペーンに当て、
          <br />
          クリックして下さるユーザに還元できるように努めます。
        </p>
      </div>
      <div className='flex items-center justify-between'>
        <ul className='w-full text-xs space-y-3'>
          <li key={'score'} className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <OcticonGraphIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              評価ポイント
            </div>
            <div>{score}</div>
          </li>
          <li key={'likes'} className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <HeartIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              総いいね数
            </div>
            <div>{likes}</div>
          </li>
          <li key={'page'} className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <PageIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              ページ数
            </div>
            <div>{page}</div>
          </li>
          <li key={'launched'} className='flex justify-between'>
            <div className='flex'>
              <span className='mr-1'>
                <CalendarIcon width={ICON_SIZE} height={ICON_SIZE} />
              </span>
              発売日
            </div>
            <time>{new Date(launched).toLocaleDateString('ja-JP')}</time>
          </li>
          <li key={'publisher'} className='flex justify-between'>
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
      <div className='space-y-4'>
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
        <div className='text-center'>
          <span className={`text-[${SUPPLEMENT_TEXT_SIZE}] text-gray-500`}>{`${transformDateJaStyle(
            scrapedAt,
          )}の商品データになります。`}</span>
        </div>
      </div>
    </div>
  )
}
