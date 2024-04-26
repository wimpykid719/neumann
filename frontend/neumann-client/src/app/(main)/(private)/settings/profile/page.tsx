'use client'

import ProfileForm from '@/components/settings/profile/Form'
import InputLoading from '@/components/settings/profile/InputLoading'
import { useUser } from '@/contexts/UserContext'

export default function ProfilePage() {
  const { user, setUser } = useUser()

  if (user) return <ProfileForm user={user} setUser={setUser} />
  return <InputLoading />
}
