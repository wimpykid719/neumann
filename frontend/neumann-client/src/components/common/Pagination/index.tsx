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
  const SMALL_DEVICE_SIBLING = 0
  const device = useDeviceWindow()

  return <Base page={page} lastPage={lastPage} siblingCount={device.width < SM ? SMALL_DEVICE_SIBLING : siblingCount} />
}
