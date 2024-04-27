import app from '@/text/app.json'
import BizRankIcon from '../icon/BizRankIcon'

export default function Footer() {
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
                <li>このサイトについて</li>
                <li>予定する機能追加について</li>
              </ul>
            </div>
            <div className='lg:max-w-40 max-w-28 w-full space-y-5'>
              <div className='font-bold'>Links</div>
              <ul className='space-y-4'>
                <li>X（Twitter）</li>
                <li>不具合報告</li>
                <li>問い合わせ</li>
              </ul>
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div className='lg:max-w-40 max-w-28 w-full space-y-5'>
              <div className='font-bold'>Legal</div>
              <ul className='space-y-4'>
                <li>利用規約</li>
                <li>プライバシーポリシー</li>
              </ul>
            </div>
            <div className='lg:max-w-40 max-w-28 w-full space-y-5'>
              <div className='font-bold'>User</div>
              <ul className='flex justify-between'>
                <li>現在のユーザ数</li>
                <li>25600</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
