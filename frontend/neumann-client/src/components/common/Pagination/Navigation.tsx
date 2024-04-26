import Link from 'next/link'
import { PaginationProps } from './Base'

type NavigationProps = {
  path?: PaginationProps['path']
  icon: JSX.Element
  page: PaginationProps['page']
  disabled: PaginationProps['disabled']
}

export default function Navigation({ path, icon, page, disabled }: NavigationProps) {
  return disabled ? (
    <button
      disabled={disabled}
      className={
        'w-6 h-6 text-gray-500 text-xs rounded font-bold flex justify-center items-center item-bg-color bg-opacity-0'
      }
    >
      {icon}
    </button>
  ) : (
    <Link
      href={`${path || ''}${page}`}
      className={
        'w-6 h-6 text-gray-500 text-xs rounded font-bold flex justify-center items-center item-bg-color bg-opacity-0 hover:bg-opacity-70'
      }
    >
      {icon}
    </Link>
  )
}
