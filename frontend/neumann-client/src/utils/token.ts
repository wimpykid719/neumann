import { AccessToken } from '@/types/accessToken'
import { DecodedAccessToken } from '@/types/accessToken'
import jwt from 'jsonwebtoken'

export const getUserNameFromAccessToken = (accessToken: AccessToken) => {
  if (!accessToken) return
  const decoded = jwt.decode(accessToken) as string | DecodedAccessToken | null
  return (typeof decoded === 'object' && decoded?.username) || undefined
}
