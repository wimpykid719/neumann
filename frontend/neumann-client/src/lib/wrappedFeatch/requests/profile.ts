import * as fetch from '@/lib/wrappedFeatch'
import { ProfileUpdateValidation } from '@/lib/zodSchema/profileUpdateValidation'
import { User } from '@/types/user'

export type ProfileUpdateData = ProfileUpdateValidation

type Response = {
  name: string
  bio: string
  x_twitter: string
  instagram: string
  facebook: string
  linkedin: string
  tiktok: string
  youtube: string
  website: string
  avatar: string
}

export async function getUserProfile(userName: User['name']) {
  return await fetch.get<Response>(`/api/v1/profiles/${userName}`, {
    revalidate: 0,
  })
}

export async function patchUserProfile(updateData: FormData, accessToken: string) {
  return await fetch.patch<FormData, Response>('/api/v1/profiles', updateData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  })
}
