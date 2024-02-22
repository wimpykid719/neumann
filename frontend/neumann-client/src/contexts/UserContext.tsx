'use client'

import { User } from '@/types/user'
import { createContext, useContext, useState } from 'react'

type UserContext = {
  setUser: (user: User | undefined) => void
  user: User | undefined
}

export const UserContext = createContext<UserContext>({
  setUser: () => {},
  user: undefined,
})

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>()

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
