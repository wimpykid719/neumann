'use client'

import AccountForm from "@/components/settings/account/Form"
import { useUser } from '@/contexts/UserContext'
import InputLoading from "@/components/settings/account/Form/InputLoading"


export default function AccountPage() {
  const { user } = useUser()

  if (user) return <AccountForm user={user} />

  return <InputLoading />
}
