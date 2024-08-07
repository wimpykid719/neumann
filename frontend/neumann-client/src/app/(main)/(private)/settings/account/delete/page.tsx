'use client'

import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { useUser } from '@/contexts/UserContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { FetchError } from '@/lib/errors'
import { deleteUser } from '@/lib/wrappedFeatch/requests/user'
import toast from '@/text/toast.json'
import { deleteLogoutStatus } from '@/utils/localStorage'
import { toastStatus } from '@/utils/toast'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AccountDeletePage() {
  const { user, setUser } = useUser()
  const { showToast } = useToast()
  const { accessToken, execSilentRefresh } = useSilentRefresh(showToast)
  const { setAccessToken } = useAccessToken()
  const router = useRouter()

  const onClick = async () => {
    const token = (await execSilentRefresh()) || accessToken
    if (!token) return showToast(toast.no_access_token, toastStatus.error)

    const res = await deleteUser(accessToken || '')
    if (res instanceof FetchError) {
      showToast(res.message, toastStatus.error)
    } else if (Object.keys(res).length === 0) {
      deleteLogoutStatus()
      setUser(undefined)
      setAccessToken('')
      showToast(toast.user_deleted, toastStatus.success)
      router.push('/')
    }
  }

  return (
    <section>
      <div className='text-center'>
        <h2 className='text-3xl mb-4'>アカウントを削除する</h2>
        <p>
          アカウントを削除すると書籍のいいね登録は出来なくなり、BizRankアカウントの <br /> データは全て削除されます。
        </p>
      </div>
      <div className='my-12 space-y-8 max-w-md p-8 mx-auto border border-gray-900 dark:border-gray-400 rounded-lg'>
        <div className='flex gap-4 justify-center max-w-60 mx-auto'>
          {user ? (
            <div className='w-12 h-12 rounded-lg shadow-sm sub-bg-color py-4 text-xs font-medium text-center dark:border dark:border-gray-600 overflow-hidden relative'>
              {user.profile.avatar ? (
                <Image
                  src={user.profile.avatar}
                  alt={`${user.profile.name || user.name}のプロフィール画像`}
                  sizes='
                        50vw,
                        (min-width: 768px) 33vw,
                        (min-width: 1024px) 25vw,
                        (min-width: 1280px) 20vw
                      '
                  fill={true}
                  className='object-cover'
                />
              ) : (
                '(,,0‸0,,)'
              )}
            </div>
          ) : (
            <div className='w-12 h-12 rounded-lg shadow item-bg-color animate-pulse dark:border dark:border-gray-600'></div>
          )}
          <div className='flex max-w-28 items-center'>
            {user ? <p>{user.name}</p> : <p className='w-24 h-6 rounded item-bg-color animate-pulse'></p>}
          </div>
        </div>
        <div className='text-center'>
          <p>削除すると以下の情報が全て失われます</p>
        </div>
        <div className='max-w-80 h-40 sub-bg-color rounded-lg p-6 shadow-sm dark:border dark:border-gray-600 mx-auto'>
          <ul className='list-disc list-inside'>
            <li key='name'>ユーザ名</li>
            <li key='email'>登録したメールアドレス</li>
            <li key='profile'>プロフィール情報</li>
            <li key='like'>いいねした書籍</li>
          </ul>
        </div>
        <div className='flex gap-9 items-center max-w-64 mx-auto'>
          <Link
            className='w-28 text-sm rounded-lg item-bg-color bg-opacity-0 hover:bg-opacity-70 text-center py-2.5'
            href={'/settings/account'}
          >
            キャンセル
          </Link>
          <button
            onClick={onClick}
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
}
