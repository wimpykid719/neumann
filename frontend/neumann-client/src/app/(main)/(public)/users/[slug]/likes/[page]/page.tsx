'use client'

import Pagination from '@/components/common/Pagination'
import Books from '@/components/profile/liked/Books'
import LoadingBooks from '@/components/profile/liked/loading/Books'
import { useToast } from '@/contexts/ToastContext'
import { FetchError } from '@/lib/errors'
import { ResponseUserLikes, getUserLikes } from '@/lib/wrappedFeatch/requests/user'
import { SlugProps } from '@/types/slug'
import { toastStatus } from '@/utils/toast'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

type PageProps = {
  page: string
}

type UserLikesProps = { params: SlugProps['params'] & PageProps }

export default function UserLikesPage({ params }: UserLikesProps) {
  const page = Number(params.page)
  const { showToast } = useToast()
  const [userLikes, setUserLikes] = useState<ResponseUserLikes>()
  const { data } = useSWR([params, page], () => getUserLikes(params.slug, page))

  useEffect(() => {
    if (data instanceof FetchError) {
      showToast(data.message, toastStatus.error)
    } else if (data) {
      setUserLikes(data)
    }
  }, [data])

  return (
    <section className='space-y-8 min-h-screen'>
      {userLikes ? <Books books={userLikes?.books || []} /> : <LoadingBooks />}
      <div className='w-full'>
        {userLikes?.pages && <Pagination page={page} lastPage={userLikes.pages.last} siblingCount={2} />}
      </div>
    </section>
  )
}
