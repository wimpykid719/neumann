import * as fetch from '@/lib/wrappedFeatch'

export type LoginData = {
  email: string
  password: string
}

type Response = {
  token: string
}

type LoginParams = {
  auth: LoginData
}

export async function postAuthToken(loginData: LoginData) {
  const params = { auth: loginData }
  return await fetch.post<LoginParams, Response>('/api/v1/auth_token', params)
}
