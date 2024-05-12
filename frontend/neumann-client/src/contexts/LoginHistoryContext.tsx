'use client'

import { LocalStorage, history } from '@/utils/localStorage'
import { createContext, useContext, useState } from 'react'

type LoginHistoryContext = {
  setLoginHistory: (history: LocalStorage) => void
  loginHistory: LocalStorage
}

export const LoginHistoryContext = createContext<LoginHistoryContext>({
  setLoginHistory: () => {},
  loginHistory: history.loggedInBefore,
})

export const useLoginHistory = () => {
  return useContext(LoginHistoryContext)
}

export const LoginHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginHistory, setLoginHistory] = useState<LocalStorage>(history.loggedInBefore)

  return (
    <LoginHistoryContext.Provider value={{ loginHistory, setLoginHistory }}>{children}</LoginHistoryContext.Provider>
  )
}
