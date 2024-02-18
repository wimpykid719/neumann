'use client'

import { AccessToken } from '@/types/accessToken'
import { createContext, useContext, useState } from 'react'

type AccessTokenContext = {
  setAccessToken: (token: string) => void
  accessToken: AccessToken
}

export const AccessTokenContext = createContext<AccessTokenContext>({
  setAccessToken: () => {},
  accessToken: '',
})

export const useAccessToken = () => {
  return useContext(AccessTokenContext)
}

export const AccessTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<AccessToken>()

  return <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>{children}</AccessTokenContext.Provider>
}
