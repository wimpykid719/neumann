import { FetchError } from '@/lib/errors'
import { getLike } from '@/lib/wrappedFeatch/requests/like'
import { AccessToken } from '@/types/accessToken'
import { BookDetail } from '@/types/book'
import { ToastType } from '@/types/toast'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'

export const useBookLikesInitialFetch = (
  accessToken: AccessToken,
  showToast: (message: string, type: ToastType) => void,
  id: BookDetail['id'],
) => {
  const [likeStatus, setLikeStatus] = useState(false)
  const { data, isLoading } = useSWRImmutable(accessToken ? [id, accessToken] : null, ([id, accessToken]) =>
    getLike(id, accessToken),
  )

  useEffect(() => {
    if (data instanceof FetchError) {
      showToast(data.message, toastStatus.error)
    } else {
      setLikeStatus(data?.liked || false)
    }
  }, [isLoading])

  return { likeStatus, setLikeStatus }
}
