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
}

type UpdateParams = {
  profile: ProfileUpdateData
}

export async function getUserProfile(userName: User['name']) {
  return await fetch.get<Response>(`/api/v1/profiles/${userName}`, {
    revalidate: 0,
  })
}

export async function patchUserProfile(updateData: ProfileUpdateData, accessToken: string) {
  const params = { profile: updateData }
  return await fetch.patch<UpdateParams, Response>('/api/v1/profiles', params, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
}
