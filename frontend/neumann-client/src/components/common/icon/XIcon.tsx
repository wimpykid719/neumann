import { SvgIconProps } from '@/types/icon'

export default function XIcon({ width = 24, height = 24, className = '' }: SvgIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9.37768 7.14759L14.1242 1.59009H12.9992L8.87893 6.4154L5.58643 1.59009H1.78955L6.76768 8.88759L1.78955 14.7151H2.91455L7.26643 9.61884L10.7436 14.7151H14.5405L9.37768 7.14759ZM7.83736 8.95134L7.33299 8.22478L3.31955 2.44321H5.04736L8.28549 7.10915L8.78986 7.83571L13.0002 13.9013H11.2724L7.83736 8.95134Z'
        fill='currentColor'
      />
    </svg>
  )
}
