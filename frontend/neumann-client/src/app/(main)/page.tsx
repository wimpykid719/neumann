'use client'

import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { useUserInitialFetch } from '@/hooks/useUserInitialFetch'
import { getUserNameFromAccessToken } from '@/utils/token'

export default function Home() {
  const { showToast } = useToast()
  const { accessToken } = useAccessToken()
  const newAccessToken = useSilentRefresh(accessToken, showToast)
  const token = newAccessToken || accessToken
  const userName = getUserNameFromAccessToken(token)
  const user = useUserInitialFetch(userName, newAccessToken || accessToken, showToast)

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>{user?.name}</div>
    </main>
  )
}
