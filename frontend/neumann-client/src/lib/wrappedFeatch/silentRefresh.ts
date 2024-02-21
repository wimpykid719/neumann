import { refreshToken } from '@/lib/wrappedFeatch/refreshTokenRequest'
import { AccessToken } from '@/types/accessToken'

export const silentRefresh = async (accessToken: AccessToken) => {
  return await refreshToken(accessToken)
}
