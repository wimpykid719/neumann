'use client'

import AccountForm from '@/components/settings/account/Form'
import InputLoading from '@/components/settings/account/InputLoading'
import { useUser } from '@/contexts/UserContext'

export default function AccountPage() {
  const { user, setUser } = useUser()

  if (user) return <AccountForm user={user} setUser={setUser} />

  return <InputLoading />
}
