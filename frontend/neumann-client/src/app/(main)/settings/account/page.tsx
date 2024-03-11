'use client'

import AccountForm from "@/components/settings/account/Form"
import { useUser } from '@/contexts/UserContext'
import InputLoading from "@/components/settings/account/InputLoading"


export default function AccountPage() {
  const { user, setUser } = useUser()

  if (user) return <AccountForm user={user} setUser={setUser} />

  return <InputLoading />
}
