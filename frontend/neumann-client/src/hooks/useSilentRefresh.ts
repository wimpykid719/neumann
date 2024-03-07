import { useAccessToken } from '@/contexts/AccessTokenContext'
import { FetchError } from '@/lib/errors'
import { silentRefresh } from '@/lib/wrappedFeatch/silentRefresh'
import { AccessToken } from '@/types/accessToken'
import { ToastType } from '@/types/toast'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'

export const useSilentRefresh = (showToast: (message: string, type: ToastType) => void) => {
  const { accessToken, setAccessToken } = useAccessToken()
  const [isRefreshed, setIsRefreshed] = useState(false)

  useEffect(() => {
    const initFetch = async (accessToken: AccessToken) => {
      const res = await silentRefresh(accessToken)
      if (res instanceof FetchError) {
        setIsRefreshed(true)
        showToast(res.message, toastStatus.error)
      } else {
        setIsRefreshed(true)
        if (res) {
          setAccessToken(res.token)
        }
      }
    }
    initFetch(accessToken)
  }, [])
  return { accessToken, isRefreshed }
}
