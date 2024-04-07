'use client'

import { useToast } from '@/contexts/ToastContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { useUserInitialFetch } from '@/hooks/useUserInitialFetch'
import app from '@/text/app.json'
import Link from 'next/link'
import BizRankIcon from '../icon/BizRankIcon'
import Avatar from './Avatar'

export default function Header() {
  const { showToast } = useToast()
  const { accessToken, isRefreshed } = useSilentRefresh(showToast)
  const { isLoading } = useUserInitialFetch(isRefreshed ? accessToken : undefined, showToast)

  return (
    <section className='flex justify-between'>
      <div>
        <Link href={'/'}>
          <h1 className='text-lg font-bold'>
            <BizRankIcon width={32} height={32} className='mr-2 inline' />
            {app.title}
          </h1>
        </Link>
      </div>
      <Avatar isRefreshed={isRefreshed} isLoading={isLoading} />
    </section>
  )
}
