type NumberProps = {
  setPage: (page: number) => void
  page: number
  selected: boolean
  disabled: boolean
  ariaCurrent: 'true' | undefined
}

export default function Number({ setPage, page, selected, disabled, ariaCurrent }: NumberProps) {
  const variants = {
    default: 'text-gray-500 item-bg-color bg-opacity-0',
    selected: 'sub-text-color bg-primary shadow-pagination',
  }

  return (
    <button
      onClick={() => setPage(page)}
      aria-current={ariaCurrent}
      disabled={disabled}
      className={`
        ${selected ? variants.selected : variants.default}
        w-6 h-6
        text-xs
        rounded font-bold
        flex justify-center items-center
        ${!disabled && 'hover:bg-opacity-70'}
      `}
    >
      {page}
    </button>
  )
}
