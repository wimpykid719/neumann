import * as fetch from '@/lib/wrappedFeatch'
import { User } from '@/types/user'

type Response = User

export async function getUser(accessToken: string) {
  return await fetch.get<Response>('/api/v1/users/', {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
}
