'use client'

import { useAccessToken } from '@/contexts/AccessTokenContext'

export default function Home() {
  const { accessToken } = useAccessToken()

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>{accessToken}</div>
    </main>
  )
}
