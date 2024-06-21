import { useUser } from '@/contexts/UserContext'
import { FetchError } from '@/lib/errors'
import { getUser } from '@/lib/wrappedFeatch/requests/user'
import { AccessToken } from '@/types/accessToken'
import { ToastType } from '@/types/toast'
import { toastStatus } from '@/utils/toast'
import { useEffect } from 'react'
import useSWRImmutable from 'swr/immutable'

export const useUserInitialFetch = (
  accessToken: AccessToken,
  showToast: (message: string, type: ToastType) => void,
) => {
  const { user, setUser } = useUser()
  const { data } = useSWRImmutable(accessToken || null, accessToken => getUser(accessToken))

  useEffect(() => {
    if (data instanceof FetchError) {
      showToast(data.message, toastStatus.error)
    } else if (data) {
      if (!user) {
        setUser(data)
      }
    }
  }, [data])
}
