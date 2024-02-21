'use client'

import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { useUser } from '@/hooks/useUser'
import { getUserNameFromAccessToken } from '@/utils/token'

export default function Home() {
  const { showToast } = useToast()
  const { accessToken } = useAccessToken()
  const newAccessToken = useSilentRefresh(accessToken, showToast)
  const token = newAccessToken || accessToken
  const userName = getUserNameFromAccessToken(token)
  const user = useUser(userName, newAccessToken || accessToken, showToast)

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>{user?.name}</div>
    </main>
  )
}
