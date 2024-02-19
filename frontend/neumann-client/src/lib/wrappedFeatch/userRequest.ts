import * as fetch from '@/lib/wrappedFeatch'
import { User } from '@/types/user'

type Response = User

export async function getUser(userName: string, accessToken: string) {
  return await fetch.get<Response>(`/api/v1/users/${userName}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
}
