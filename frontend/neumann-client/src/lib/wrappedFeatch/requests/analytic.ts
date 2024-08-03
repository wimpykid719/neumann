import * as fetch from '@/lib/wrappedFeatch'

type analytic = {
  name: string
  count: number
}

type ResponseAnalytic = {
  user_analytics: analytic[]
  user_total: number
}

export async function getUserAnalytics() {
  return await fetch.get<ResponseAnalytic>('/api/v1/user_analytics', {
    credentials: 'include',
  })
}
