'use client'

import InputLoading from '@/components/settings/account/InputLoading'
import { useUser } from '@/contexts/UserContext'
import Link from 'next/link'

export default function AccountDeletePage() {
  const { user, setUser } = useUser()

  if (user)
    return (
      <section className='space-y-12'>
        <div className='text-center'>
          <h2 className='text-3xl mb-4'>アカウントを削除する</h2>
          <p>
            アカウントを削除すると書籍のいいね登録は出来なくなり、BizRankアカウントの <br /> データは全て削除されます。
          </p>
        </div>
        <div className='space-y-8 max-w-md p-8 mx-auto border border-gray-900 dark:border-gray-400 rounded-lg'>
          <div className='flex gap-4 justify-center mx-auto'>
            <div className='w-12 h-12 rounded-lg shadow-sm sub-bg-color py-4 text-xs font-medium text-center dark:border dark:border-gray-600'>
              (,,0‸0,,)
            </div>
            <div className='flex items-center'>
              <p>{user.name}</p>
            </div>
          </div>
          <div className='text-center'>
            <p>削除すると以下の情報が全て失われます</p>
          </div>
          <div className='w-64 h-40 sub-bg-color rounded-lg p-6 shadow-sm dark:border dark:border-gray-600 mx-auto'>
            <ul className='list-disc list-inside'>
              <li>ユーザ名</li>
              <li>登録したメールアドレス</li>
              <li>プロフィール情報</li>
              <li>いいねした書籍</li>
            </ul>
          </div>
          <div className='flex gap-9 items-center max-w-64 mx-auto'>
            <Link
              className='w-28 text-sm rounded-lg item-bg-color bg-opacity-0 hover:bg-opacity-70 text-center py-2.5'
              href={'/'}
            >
              キャンセル
            </Link>
            <button
              onClick={() => {}}
              className='
                w-28 bg-primary
                hover:bg-opacity-70
                focus:ring-4
                focus:outline-none
                focus:ring-primary
                focus:ring-opacity-70
                font-medium rounded-lg
                text-sm px-5 py-2.5
                text-center sub-text-color
              '
            >
              削除
            </button>
          </div>
        </div>
      </section>
    )

  return <InputLoading />
}
