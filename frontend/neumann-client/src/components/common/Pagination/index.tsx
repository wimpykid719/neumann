'use client'

import { useDeviceWindow } from '@/hooks/useDeviceWindow'
import Base from './Base'
import { PaginationProps } from './Base'

type ResponsiblePagination = {
  page: PaginationProps['page']
  lastPage: PaginationProps['lastPage']
  siblingCount: PaginationProps['siblingCount']
}

export const INITIAL_PAGE = 1

export default function ResponsiblePagination({ page, lastPage, siblingCount }: ResponsiblePagination) {
  const SM = 640
  const SMALL_DEVICE_SIBLING = 1
  const device = useDeviceWindow()

  return (
    <>
      {INITIAL_PAGE < lastPage && (
        <Base
          page={page}
          lastPage={lastPage}
          siblingCount={device.width < SM || 100 < lastPage ? SMALL_DEVICE_SIBLING : siblingCount}
        />
      )}
    </>
  )
}
