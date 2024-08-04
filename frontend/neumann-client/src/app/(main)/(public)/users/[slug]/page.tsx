'use client'

import Pagination, { INITIAL_PAGE } from '@/components/common/Pagination'
import Books from '@/components/profile/liked/Books'
import LoadingBooks from '@/components/profile/liked/loading/Books'
import { useToast } from '@/contexts/ToastContext'
import { FetchError } from '@/lib/errors'
import { ResponseUserLikes, getUserLikes } from '@/lib/wrappedFeatch/requests/user'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

type SlugProps = {
  slug: string
}

export default function UserLikesPage({ params }: { params: SlugProps }) {
  const { showToast } = useToast()
  const [userLikes, setUserLikes] = useState<ResponseUserLikes>()
  const { data } = useSWR(params, params => getUserLikes(params.slug))

  useEffect(() => {
    if (data instanceof FetchError) {
      showToast(data.message, toastStatus.error)
    } else if (data) {
      setUserLikes(data)
    }
  }, [data])

  return (
    <section className='space-y-8 h-screen'>
      {userLikes ? <Books books={userLikes?.books || []} /> : <LoadingBooks />}
      <div className='w-full'>
        {userLikes?.pages && (
          <Pagination
            path={`${params.slug}/likes/`}
            page={INITIAL_PAGE}
            lastPage={userLikes.pages.last}
            siblingCount={2}
          />
        )}
      </div>
    </section>
  )
}
