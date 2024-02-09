import { FetchError } from '@/lib/errors'
import * as fetch from '@/lib/wrappedFeatch'

type LoginData = {
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
  try {
    const params = {
      auth: loginData,
    }
    return await fetch.post<LoginParams, Response>('/api/v1/auth_token', params)
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(`Fetch error: ${error.message}, status: ${error.status}`)
    } else {
      // Handle other types of errors
      console.error('Unknown error:', error)
    }
  }
}
