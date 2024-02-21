import { FetchError } from '@/lib/errors'
import { silentRefresh } from '@/lib/wrappedFeatch/silentRefresh'
import { AccessToken } from '@/types/accessToken'
import { ToastType } from '@/types/toast'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'

export const useSilentRefresh = (accessToken: AccessToken, showToast: (message: string, type: ToastType) => void) => {
  const [newAccessToken, setNewAccessToken] = useState<AccessToken>()

  useEffect(() => {
    const initFetch = async (accessToken: AccessToken) => {
      const res = await silentRefresh(accessToken)
      if (res instanceof FetchError) {
        showToast(res.message, toastStatus.error)
      } else {
        setNewAccessToken(res?.token)
      }
    }
    initFetch(accessToken)
  }, [])
  return newAccessToken
}
