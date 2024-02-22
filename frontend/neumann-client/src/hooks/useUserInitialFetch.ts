import { FetchError } from '@/lib/errors'
import { getUser } from '@/lib/wrappedFeatch/userRequest'
import { AccessToken } from '@/types/accessToken'
import { ToastType } from '@/types/toast'
import { User } from '@/types/user'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export const useUserInitialFetch = (
  userName: string | undefined,
  accessToken: AccessToken,
  showToast: (message: string, type: ToastType) => void,
) => {
  const [user, setUser] = useState<User>()
  const { data } = useSWR(userName && accessToken ? [userName, accessToken] : null, ([userName, accessToken]) =>
    getUser(userName, accessToken),
  )

  useEffect(() => {
    if (data instanceof FetchError) {
      showToast(data.message, toastStatus.error)
    } else {
      setUser(data)
    }
  }, [data])

  return user
}
