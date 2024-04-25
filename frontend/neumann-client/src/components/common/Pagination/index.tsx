'use client'

import { useDeviceWindow } from '@/hooks/useDeviceWindow'
import Base from './Base'
import { PaginationProps } from './Base'

type ResponsiblePagination = {
  path?: PaginationProps['path']
  page: PaginationProps['page']
  lastPage: PaginationProps['lastPage']
  siblingCount: PaginationProps['siblingCount']
}

export const INITIAL_PAGE = 1

export default function ResponsiblePagination({ path, page, lastPage, siblingCount }: ResponsiblePagination) {
  const SM = 640
  const SMALL_DEVICE_SIBLING = 1
  const device = useDeviceWindow()

  return (
    <>
      {INITIAL_PAGE < lastPage && (
        <Base
          path={path}
          page={page}
          lastPage={lastPage}
          siblingCount={device.width < SM || 100 < lastPage ? SMALL_DEVICE_SIBLING : siblingCount}
        />
      )}
    </>
  )
}
