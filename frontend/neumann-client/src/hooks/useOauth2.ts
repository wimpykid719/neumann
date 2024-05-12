import { useLoginHistory } from '@/contexts/LoginHistoryContext'
import { FetchError } from '@/lib/errors'
import { postGoogleOuth2 } from '@/lib/wrappedFeatch/requests/googleOauth2'
import toastText from '@/text/toast.json'
import { ToastType } from '@/types/toast'
import { history, updateLogoutStatus } from '@/utils/localStorage'
import { toastStatus } from '@/utils/toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useOauth2 = (showToast: (message: string, type: ToastType) => void) => {
  const [accessToken, setAccessToken] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setLoginHistory } = useLoginHistory()

  const getURLParams = (key: string) => searchParams.get(key)
  const execOauth2Authorization = async () => {
    const state = getURLParams('state')
    const code = getURLParams('code')
    const error = getURLParams('error')
    if (!!error) {
      router.push('/')
      return
    }

    if (code && state) {
      const oauth2Data = { state, code }
      const res = await postGoogleOuth2(oauth2Data)

      if (res instanceof FetchError) {
        showToast(res.message, toastStatus.error)
        router.push('/')
      } else {
        if (res) {
          showToast(toastText.user_authorized, toastStatus.success)
          setAccessToken(res.token)
          updateLogoutStatus()
          setLoginHistory(history.loggedInBefore)
          router.push('/')
        }
      }
    }
  }

  useEffect(() => {
    execOauth2Authorization()
  }, [])
  return { accessToken }
}
