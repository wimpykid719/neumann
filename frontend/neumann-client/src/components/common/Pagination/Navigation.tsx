type NavigationProps = {
  icon: JSX.Element
  setPage: (page: number) => void
  page: number
  disabled: boolean
}

export default function Navigation({ icon, setPage, page, disabled }: NavigationProps) {
  return (
    <button
      onClick={() => setPage(page)}
      disabled={disabled}
      className={`w-6 h-6 text-gray-500 text-xs rounded font-bold flex justify-center items-center item-bg-color bg-opacity-0 ${
        !disabled && 'hover:bg-opacity-70'
      }`}
    >
      {icon}
    </button>
  )
}
