import app from '@/text/app.json'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import BizRankIcon from '../icon/BizRankIcon'

const DynamicUsersChart = dynamic(() => import('./UsersChart'), { ssr: false })

export default function Footer() {
  const BIZRANK_X = 'https://x.com/biz_rank57580'
  const DEFECT_REPORT = 'https://forms.gle/SthcCR8ELKGQ5Bgt7'
  const INQUIRY = 'https://forms.gle/3VHsnYvQUDHsTgUh7'
  const FEATURE = 'https://github.com/users/wimpykid719/projects/2'

  return (
    <div className='sub-bg-color'>
      <div className='lg:flex max-w-5xl mx-auto py-12 px-4 text-xs lg:space-y-0 space-y-8'>
        <div className='space-y-4 lg:max-w-64 md:max-w-96 max-w-64 w-full lg:m-0 m-auto'>
          <div className='text-sm font-bold'>
            <BizRankIcon width={32} height={32} className='mr-2 inline' />
            {app.title}
          </div>
          <p className='leading-5'>
            本当に価値のあるビジネス書籍を独自
            <br />
            アルゴリズムで評価して紹介
          </p>
        </div>
        <div className='lg:flex-1 lg:flex lg:m-0 lg:space-y-0 lg:max-w-none md:max-w-96 max-w-64 mx-auto space-y-4'>
          <div className='flex justify-between w-full'>
            <div className='lg:max-w-40 max-w-28 w-full space-y-5'>
              <div className='font-bold'>About</div>
              <ul className='space-y-4'>
                <li key='aboutsite'>
                  <Link href={'/policies/about'}>このサイトについて</Link>
                </li>
                <li key='feature'>
                  <a href={FEATURE} target='_blank' rel='nofollow'>
                    予定する機能追加について
                  </a>
                </li>
              </ul>
            </div>
            <div className='lg:max-w-40 max-w-28 w-full space-y-5'>
              <div className='font-bold'>Links</div>
              <ul className='space-y-4'>
                <li key='official-x'>
                  <a href={BIZRANK_X} target='_blank' rel='nofollow'>
                    X（Twitter）
                  </a>
                </li>
                <li key='defect-report'>
                <a href={DEFECT_REPORT} target='_blank' rel='nofollow'>
                  不具合報告
                </a>
                </li>
                <li key='inquiry'>
                <a href={INQUIRY} target='_blank' rel='nofollow'>
                  問い合わせ
                </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div className='lg:max-w-40 max-w-28 w-full space-y-5'>
              <div className='font-bold'>Legal</div>
              <ul className='space-y-4'>
                <li key='terms'>
                  <Link href={'/policies/terms'}>利用規約</Link>
                </li>
                <li key='privacy'>
                  <Link href={'/policies/privacy'}>プライバシーポリシー</Link>
                </li>
              </ul>
            </div>
            <div className='lg:max-w-40 max-w-28 w-full space-y-5'>
              <div className='font-bold'>User</div>
              <DynamicUsersChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
