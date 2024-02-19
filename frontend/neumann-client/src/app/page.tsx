'use client'

import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { FetchError } from '@/lib/errors'
import { refreshToken } from '@/lib/wrappedFeatch/refreshTokenRequest'
import { getUser } from '@/lib/wrappedFeatch/userRequest'
import { AccessToken } from '@/types/accessToken'
import { User } from '@/types/user'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'

export default function Home() {
  const { accessToken, setAccessToken } = useAccessToken()
  const { showToast } = useToast()
  const [user, setUser] = useState<User | undefined>()

  const silentRefresh = async (accessToken: AccessToken) => {
    const tokenRes = await refreshToken(accessToken)
    if (!tokenRes) return

    if (tokenRes instanceof FetchError) {
      showToast(tokenRes.message, toastStatus.error)
    } else {
      return tokenRes.token
    }
  }

  const initialUser = async (userName: string, accessToken: AccessToken) => {
    const newAccessToken = await silentRefresh(accessToken)
    const token = newAccessToken || accessToken
    if (!token) return

    const res = await getUser(userName, token)
    if (res instanceof FetchError) {
      console.log(res.message)
    } else {
      setAccessToken(token)
      return res
    }
  }

  useEffect(() => {
    ;(async () => {
      const res = await initialUser('テスト1', accessToken)
      if (res) {
        setUser(res)
      }
    })()
  }, [])

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>{user ? user.name : undefined}</div>
    </main>
  )
}
