import { refreshToken } from '@/lib/wrappedFeatch/requests/refreshToken'
import { AccessToken } from '@/types/accessToken'

export const silentRefresh = async (accessToken: AccessToken) => {
  return await refreshToken(accessToken)
}
