'use client'

import ProfileForm from "@/components/settings/profile/Form"
import { useUser } from "@/contexts/UserContext"
import InputLoading from "@/components/settings/profile/InputLoading"

export default function ProfilePage() {
  const { user, setUser } = useUser()

  if (user) return <ProfileForm user={user} setUser={setUser} />
  return <InputLoading />
}
