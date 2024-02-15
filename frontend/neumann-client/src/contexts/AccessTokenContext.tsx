'use client'

import { createContext, useContext, useState } from 'react'

type AccessTokenContext = {
  setAccessToken: (token: string) => void
  accessToken: string
}

export const AccessTokenContext = createContext<AccessTokenContext>({
  setAccessToken: () => {},
  accessToken: '',
})

export const useAccessToken = () => {
  return useContext(AccessTokenContext)
}

export const AccessTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>('')

  return <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>{children}</AccessTokenContext.Provider>
}
