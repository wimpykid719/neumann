import Card from '@/components/common/Card'
import { MarkdownRenderer } from '@/components/common/MarkdownRender'
import BizRankIcon from '@/components/common/icon/BizRankIcon'
import { readMarkdown } from '@/lib/readMarkdown'
import app from '@/text/app.json'
import { SUPPLEMENT_TEXT_SIZE } from '@/utils/constant'

export default function aboutPage() {
  const RANKING = 1
  const BOOK_TITLE = 'ＵＳＪを劇的に変えた、たった１つの考え方　成功を引き寄せるマーケティング入門'
  const BOOK_IMG_URL = 'https://m.media-amazon.com/images/I/81+AV0WrM3L._SL1500_.jpg'
  const LIKES = 120
  const bizrankMd = readMarkdown('src/md/about/bizrank.md')
  const featureMd = readMarkdown('src/md/about/feature.md')
  const developerMd = readMarkdown('src/md/about/developer.md')

  return (
    <div className='break-words space-y-8'>
      <div className='lg:flex lg:space-x-28'>
        <div className='lg:my-auto w-48 mx-auto my-12'>
          <Card ranking={RANKING} title={BOOK_TITLE} img_url={BOOK_IMG_URL} likes={LIKES} />
        </div>
        <div className='lg:flex-1'>
          <MarkdownRenderer id={'about-renderer'} className={'common-renderer'} children={bizrankMd.content} />
        </div>
      </div>
      <div className='lg:flex-row flex-col-reverse flex lg:space-x-12'>
        <div className='lg:flex-1'>
          <MarkdownRenderer id={'about-renderer'} className={'common-renderer'} children={featureMd.content} />
        </div>
        <div className='lg:my-auto space-y-2 lg:w-auto w-[200px] lg:mx-0 mx-auto my-12'>
          <div className='lg:flex lg:space-x-4 lg:space-y-0 space-y-4 flex-wrap'>
            <div className='flex gap-4 w-[200px]'>
              <div className='w-14 h-14 bg-primary'></div>
              <div className='w-14 h-14 sub-bg-color'></div>
              <div className='w-14 h-14 bg-secondary'></div>
            </div>
            <div className='flex gap-4 w-[200px]'>
              <div className='w-14 h-14 bg-success'></div>
              <div className='w-14 h-14 bg-warning'></div>
              <div className='w-14 h-14 bg-gray-900 dark:bg-gray-50'></div>
            </div>
          </div>
          <span className={`text-[${SUPPLEMENT_TEXT_SIZE}] text-gray-500 block text-right`}>
            ※BizRankのカラースキーム
          </span>
        </div>
      </div>

      <div className='lg:flex lg:space-x-28 space-y-12'>
        <div className='text-xl font-bold my-auto lg:text-left text-center'>
          <BizRankIcon width={60} height={60} className='mr-2 inline' />
          {app.title}
        </div>
        <div className='lg:flex-1'>
          <MarkdownRenderer id={'about-renderer'} className={'common-renderer'} children={developerMd.content} />
        </div>
      </div>
    </div>
  )
}
