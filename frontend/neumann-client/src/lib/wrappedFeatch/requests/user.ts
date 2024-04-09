import * as fetch from '@/lib/wrappedFeatch'
import { PageParams, PagyMeta } from '@/types/pagy'
import { User } from '@/types/user'

type Response = User
type ResponseUserNames = {
  user_names: { name: User['name'] }[]
  pages: PagyMeta
}

export async function getUser(accessToken: string) {
  return await fetch.get<Response>('/api/v1/users/', {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
}

export async function getUserNames(page = 1) {
  return await fetch.get<ResponseUserNames, PageParams>('/api/v1/users_name/', {
    params: { page },
  })
}
