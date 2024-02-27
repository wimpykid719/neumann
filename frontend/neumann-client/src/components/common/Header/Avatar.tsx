import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useUser } from '@/contexts/UserContext'
import { deleteRefreshToken } from '@/lib/wrappedFeatch/logoutRequest'
import { isLoggedInBefore } from '@/utils/localStorage'
import { updateLogoutStatus } from '@/utils/localStorage'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import HurtIcon from '../icon/HurtIcon'
import LogoutIcon from '../icon/LogoutIcon'
import SettingsIcon from '../icon/SettingsIcon'

type AvatarProps = {
  isRefreshed: boolean
  isLoading: boolean
}

export default function Avatar({ isRefreshed, isLoading }: AvatarProps) {
  const { user, setUser } = useUser()
  const { setAccessToken } = useAccessToken()
  const [isOpen, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const documentClickHandler = useRef<(e: MouseEvent) => void>(() => {})
  const [loginStatus, setLoginStatus] = useState(true)
  const variants = {
    visible: { top: '64px', opacity: 1, scale: 1 },
    hidden: { opacity: 0, bottom: 0, scale: 0.5 },
  }

  useEffect(() => {
    setLoginStatus(isLoggedInBefore())
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

  const removeDocumentClickHandler = () => {
    document.removeEventListener('click', documentClickHandler.current)
  }

  const logout = async () => {
    const res = await deleteRefreshToken()
    if (Object.keys(res).length === 0) {
      updateLogoutStatus()
      setUser(undefined)
      setAccessToken('')
    }
  }

  if ((loginStatus && !user && !isRefreshed) || isLoading)
    return (
      <div className='w-12 h-12 rounded-lg shadow sub-bg-color animate-pulse dark:border dark:border-gray-600'></div>
    )

  return (
    <>
      {user ? (
        <div className='relative'>
          <button
            onClick={handleClick}
            className='w-12 h-12 rounded-lg shadow sub-bg-color text-xs font-medium text-center dark:border dark:border-gray-600'
          >
            (,,0‸0,,)
          </button>
          {isOpen && (
            <motion.div
              initial={{ right: 0, opacity: 0, scale: 0.3 }}
              animate={isOpen ? 'visible' : 'hidden'}
              variants={variants}
              transition={{ ease: 'easeOut', duration: 0.2 }}
              className='absolute rounded-lg shadow sub-bg-color dark:border dark:border-gray-600 min-w-56'
              ref={menuRef}
            >
              <div className='font-bold p-3'>{user?.name}</div>
              <ul>
                <li className='flex items-center p-3 cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-100'>
                  <span className='inline-flex items-center w-7'>
                    <HurtIcon />
                  </span>
                  いいねした本
                </li>
                <li className='flex items-center p-3 cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-100'>
                  <span className='inline-flex items-center w-7'>
                    <SettingsIcon />
                  </span>
                  アカウント設定
                </li>
              </ul>
              <button
                onClick={logout}
                className='flex items-center p-3 cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-100 rounded-b-lg w-full'
              >
                <span className='inline-flex items-center w-7'>
                  <LogoutIcon />
                </span>
                ログアウト
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <div className='flex justify-between w-60'>
          <Link
            href='/signup'
            className='w-28 h-11 flex justify-center items-center text-sm font-bold hover:opacity-70'
          >
            会員登録
          </Link>
          <Link
            href='/login'
            className='w-28 h-11 bg-primary text-center rounded-lg flex justify-center items-center sub-text-color text-sm font-bold hover:opacity-70'
          >
            ログイン
          </Link>
        </div>
      )}
    </>
  )
}
