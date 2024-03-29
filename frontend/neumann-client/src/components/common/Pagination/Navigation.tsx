import Link from 'next/link'

type NavigationProps = {
  icon: JSX.Element
  page: number
  disabled: boolean
}

export default function Navigation({ icon, page, disabled }: NavigationProps) {
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
      href={`/${page}`}
      className={
        'w-6 h-6 text-gray-500 text-xs rounded font-bold flex justify-center items-center item-bg-color bg-opacity-0 hover:bg-opacity-70'
      }
    >
      {icon}
    </Link>
  )
}
