import * as fetch from '@/lib/wrappedFeatch'

export type SignupData = {
  name: string
  email: string
  password: string
}

type Response = {
  token: string
}

type SignupParams = {
  user: SignupData
}

export async function postUserCreate(signupData: SignupData) {
  const params = { user: signupData }
  return await fetch.post<SignupParams, Response>('/api/v1/users', params)
}
