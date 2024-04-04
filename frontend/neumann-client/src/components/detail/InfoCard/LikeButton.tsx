'use client'

import HurtIcon from '@/components/common/icon/HurtIcon'
import { useToast } from '@/contexts/ToastContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { FetchError } from '@/lib/errors'
import { deleteLike, getLike, postLike } from '@/lib/wrappedFeatch/requests/like'
import toastText from '@/text/toast.json'
import { BookDetail } from '@/types/book'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

type LikeButtonProps = {
  id: BookDetail['id']
  likes: BookDetail['likes']
}

export default function LikeButton({ id, likes }: LikeButtonProps) {
  const { showToast } = useToast()
  const { accessToken, execSilentRefresh } = useSilentRefresh(showToast)

  const [likesCount, setLikesCount] = useState(likes)
  const [likeStatus, setLikeStatus] = useState(false)

  const bookData = { id }
  const { data, isLoading } = useSWR(accessToken ? [bookData, accessToken] : null, ([bookData, accessToken]) =>
    getLike(bookData, accessToken),
  )

  useEffect(() => {
    if (data instanceof FetchError) {
      showToast(data.message, toastStatus.error)
    } else {
      setLikeStatus(data?.liked || false)
    }
  }, [isLoading])

  const submitLike = async (id: BookDetail['id']) => {
    const token = (await execSilentRefresh()) || accessToken
    if (!token) return showToast(toastText.no_access_token, toastStatus.error)

    const res = likeStatus ? await deleteLike(bookData, token) : await postLike(bookData, token)

    if (res instanceof FetchError) {
      showToast(res.message, toastStatus.error)
    } else {
      const count = likeStatus ? -1 : 1
      setLikeStatus(res.liked)
      setLikesCount(prelikesCount => prelikesCount + count)
    }
  }

  return (
    <div className='flex items-center'>
      <button
        onClick={() => submitLike(id)}
        className={`
          h-8 w-8
          ${likeStatus ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-400'}
          text-gray-500 pt-1.5
          flex justify-center rounded-full mr-2
        `}
      >
        <HurtIcon width={22} height={22} />
      </button>
      <span className='text-xs'>{likesCount}</span>
    </div>
  )
}
