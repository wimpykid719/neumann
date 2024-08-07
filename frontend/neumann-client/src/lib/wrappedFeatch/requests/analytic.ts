import * as fetch from '@/lib/wrappedFeatch'

type analytic = {
  name: string
  count: number
}

export type ResponseAnalytic = {
  user_analytics: analytic[]
  user_total: number
}

const NO_CACHE_SSR = 0

export async function getUserAnalytics() {
  return await fetch.get<ResponseAnalytic>('/api/v1/user_analytics', {
    revalidate: NO_CACHE_SSR,
  })
}
