import Link from 'next/link'
import { PaginationProps } from './Base'

type NumberProps = {
  path?: PaginationProps['path']
  page: PaginationProps['page']
  selected: boolean
  disabled: boolean
  ariaCurrent?: 'true'
}

export default function Number({ path, page, disabled, selected, ariaCurrent }: NumberProps) {
  const variants = {
    default: 'text-gray-500 item-bg-color bg-opacity-0',
    selected: 'sub-text-color bg-primary shadow-pagination',
  }

  return disabled ? (
    <button
      aria-current={ariaCurrent}
      disabled={disabled}
      className={`
          ${selected ? variants.selected : variants.default}
          w-6 h-6
          text-xs
          rounded font-bold
          flex justify-center items-center
        `}
    >
      {page}
    </button>
  ) : (
    <Link
      href={`${path || ''}${page}`}
      aria-current={ariaCurrent}
      className={`
        ${selected ? variants.selected : variants.default}
        ${page < 100 ? 'w-6' : 'px-1'} h-6
        text-xs
        rounded font-bold
        flex justify-center items-center
        hover:bg-opacity-70
      `}
    >
      {page}
    </Link>
  )
}
