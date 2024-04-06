'use client'

import HeartLikesIcon from '@/components/common/icon/HeartLikesIcon'
import { useToast } from '@/contexts/ToastContext'
import { useBookLikesInitialFetch } from '@/hooks/useBookLikesInitialFetch'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { FetchError } from '@/lib/errors'
import { deleteLike, postLike } from '@/lib/wrappedFeatch/requests/like'
import toastText from '@/text/toast.json'
import { BookDetail } from '@/types/book'
import { toastStatus } from '@/utils/toast'
import { motion } from 'framer-motion'
import { useState } from 'react'

type LikeButtonProps = {
  id: BookDetail['id']
  likes: BookDetail['likes']
}

export default function LikeButton({ id, likes }: LikeButtonProps) {
  const { showToast } = useToast()
  const { accessToken, execSilentRefresh } = useSilentRefresh(showToast)
  const { likeStatus, setLikeStatus } = useBookLikesInitialFetch(accessToken, showToast, id)
  const [isClicked, setIsClicked] = useState(false)
  const variants = {
    clicked: { scale: [1.2, 1] },
    notClicked: { scale: 1 },
  }

  const [likesCount, setLikesCount] = useState(likes)

  const submitLike = async (id: BookDetail['id']) => {
    const bookData = { id }
    const token = (await execSilentRefresh()) || accessToken
    if (!token) return showToast(toastText.no_access_token, toastStatus.error)

    const res = likeStatus ? await deleteLike(id, token) : await postLike(bookData, token)

    if (res instanceof FetchError) {
      showToast(res.message, toastStatus.error)
    } else {
      const count = likeStatus ? -1 : 1
      setLikeStatus(res.liked)
      setLikesCount(prelikesCount => prelikesCount + count)
      setIsClicked(true)
      setTimeout(() => {
        setIsClicked(false)
      }, 1000)
    }
  }

  return (
    <div className='flex items-center'>
      <motion.button
        transition={{ ease: 'easeOut', duration: 0.3 }}
        variants={variants}
        animate={isClicked && likeStatus ? 'clicked' : 'notClicked'}
        onClick={() => submitLike(id)}
        className={`
          h-8 w-8
          ${likeStatus ? 'bg-primary bg-opacity-10 dark:bg-opacity-30' : 'bg-gray-300 dark:bg-gray-400'}
          flex justify-center items-center rounded-full mr-2
        `}
      >
        <HeartLikesIcon
          className='overflow-visible'
          width={22}
          height={22}
          likeStatus={likeStatus}
          isClicked={isClicked}
        />
      </motion.button>
      <span className='text-xs'>{likesCount}</span>
    </div>
  )
}
