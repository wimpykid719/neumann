import { useLoginHistory } from '@/contexts/LoginHistoryContext'
import { useUser } from '@/contexts/UserContext'
import { useLogout } from '@/hooks/useLogout'
import { isLoggedInBefore } from '@/utils/localStorage'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import HeartIcon from '../icon/HeartIcon'
import LogoutIcon from '../icon/LogoutIcon'
import SettingsIcon from '../icon/SettingsIcon'

export default function Avatar() {
  const { user } = useUser()
  const { execLogout } = useLogout()
  const [isOpen, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const documentClickHandler = useRef<(e: MouseEvent) => void>(() => {})
  const { loginHistory, setLoginHistory } = useLoginHistory()
  const keys = {
    goodBooks: 'goodBooks',
    accountSettings: 'accountSettings',
  }

  useEffect(() => {
    setLoginHistory(localStorage.getItem('isLoggedIn'))
    documentClickHandler.current = e => {
      if (e.target === null) return
      // メニューの内側をクリックした場合何もしない、as Nodeに関してはクリックされる要素の型を推論するのは難しいため
      if (menuRef.current?.contains(e.target as Node)) return

      setOpen(false)
      removeDocumentClickHandler()
    }
  }, [])

  const handleClick = () => {
    if (isOpen) return

    setOpen(true)
    document.addEventListener('click', documentClickHandler.current)
  }

  const emojiFace = (isOpen: boolean) => (isOpen ? '(,,0‸0,,)' : '(,,-‸-,,)')

  const removeDocumentClickHandler = () => {
    document.removeEventListener('click', documentClickHandler.current)
  }

  const logout = async () => {
    await execLogout('/')
  }

  // ログインしてないユーザに対しても一瞬ローディング状態が表示されてしまうため微妙だが、
  // 実装するにはサーバサイドでの判定が必要になると思われる
  if (isLoggedInBefore(loginHistory) && !user)
    return (
      <div className='w-12 h-12 rounded-lg shadow item-bg-color animate-pulse dark:border dark:border-gray-600'></div>
    )

  return (
    <>
      {user ? (
        <div className='relative'>
          <button
            onClick={handleClick}
            className='w-12 h-12 rounded-lg shadow sub-bg-color text-xs font-medium text-center dark:border dark:border-gray-600 overflow-hidden relative'
          >
            {user.profile.avatar ? (
              <Image
                src={user.profile.avatar}
                alt={`${user.profile.name}のプロフィール画像`}
                sizes='
                          50vw,
                          (min-width: 768px) 33vw,
                          (min-width: 1024px) 25vw,
                          (min-width: 1280px) 20vw
                        '
                fill={true}
                className='absolute object-cover'
              />
            ) : (
              emojiFace(isOpen)
            )}
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ right: 0, opacity: 0, scale: 0.3 }}
                animate={{ top: '64px', opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
                className='absolute z-10 rounded-lg shadow sub-bg-color dark:border dark:border-gray-600 min-w-56'
                ref={menuRef}
              >
                <Link
                  className='block w-full font-bold p-3 rounded-t-lg dark:hover:bg-gray-600 hover:bg-gray-100'
                  href={`/users/${user.name}`}
                >
                  {user.profile.name || user.name}
                </Link>

                <ul>
                  <li
                    key={keys.goodBooks}
                    className='flex items-center cursor-pointer p-3 dark:hover:bg-gray-600 hover:bg-gray-100'
                  >
                    <span className='inline-flex items-center w-7'>
                      <HeartIcon />
                    </span>
                    いいねした本
                  </li>
                  <li key={keys.accountSettings}>
                    <Link
                      href={'/settings/account'}
                      className='flex items-center p-3 dark:hover:bg-gray-600 hover:bg-gray-100'
                    >
                      <span className='inline-flex items-center w-7'>
                        <SettingsIcon />
                      </span>
                      アカウント設定
                    </Link>
                  </li>
                </ul>
                <button
                  onClick={logout}
                  className='flex items-center p-3 dark:hover:bg-gray-600 hover:bg-gray-100 rounded-b-lg w-full'
                >
                  <span className='inline-flex items-center w-7'>
                    <LogoutIcon />
                  </span>
                  ログアウト
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className='flex justify-between max-w-60'>
          <Link
            href='/signup'
            className='sm:w-28 w-20 sm:h-11 h-9 flex justify-center items-center sm:text-sm text-xs font-bold hover:opacity-70'
          >
            会員登録
          </Link>
          <Link
            href='/login'
            className='sm:w-28 w-20 sm:h-11 h-9 bg-primary text-center rounded-lg flex justify-center items-center sub-text-color sm:text-sm text-xs font-bold hover:opacity-70'
          >
            ログイン
          </Link>
        </div>
      )}
    </>
  )
}
