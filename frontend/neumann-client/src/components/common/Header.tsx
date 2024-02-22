'use client'
import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { useUserInitialFetch } from '@/hooks/useUserInitialFetch'
import app from '@/text/app.json'
import { getUserNameFromAccessToken } from '@/utils/token'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import BizRankIcon from './icon/BizRankIcon'
import HurtIcon from './icon/HurtIcon'
import LogoutIcon from './icon/LogoutIcon'
import SettingsIcon from './icon/SettingsIcon'

export default function Header() {
  // ユーザ情報・サイレントリフレッシュに関する値
  const { showToast } = useToast()
  const { accessToken } = useAccessToken()
  const newAccessToken = useSilentRefresh(accessToken, showToast)
  const token = newAccessToken || accessToken
  const userName = getUserNameFromAccessToken(token)
  const user = useUserInitialFetch(userName, newAccessToken || accessToken, showToast)

  // メニューに関する値
  const [isOpen, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const documentClickHandler = useRef<(e: MouseEvent) => void>(() => {})
  const variants = {
    visible: { top: '64px', opacity: 1, scale: 1 },
    hidden: { opacity: 0, bottom: 0, scale: 0.5 },
  }

  useEffect(() => {
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

  return (
    <section className='flex justify-between py-7'>
      <div>
        <h1 className='text-lg font-bold'>
          <BizRankIcon width={32} height={32} className='mr-2 inline' />
          {app.title}
        </h1>
      </div>
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
              <li className='flex items-center p-3 cursor-pointer hover:bg-gray-500'>
                <span className='inline-flex items-center w-7'>
                  <HurtIcon />
                </span>
                いいねした本
              </li>
              <li className='flex items-center p-3 cursor-pointer hover:bg-gray-500'>
                <span className='inline-flex items-center w-7'>
                  <SettingsIcon />
                </span>
                アカウント設定
              </li>
              <li className='flex items-center p-3 cursor-pointer hover:bg-gray-500 rounded-b-lg'>
                <span className='inline-flex items-center w-7'>
                  <LogoutIcon />
                </span>
                ログアウト
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  )
}
