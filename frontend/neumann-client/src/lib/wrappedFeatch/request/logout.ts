import * as fetch from '@/lib/wrappedFeatch'

export async function deleteRefreshToken() {
  return await fetch.destroy<{}>('/api/v1/auth_token', { credentials: 'include' })
}
