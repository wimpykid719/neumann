import { SvgIconProps } from '@/components/common/icon/types'

export default function ErrorIcon({ width = 22, height = 22, className = '' }: SvgIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.4419 0.821594C5.07936 0.821594 0.816862 5.08409 0.816862 10.4466C0.816862 15.8091 5.07936 20.0716 10.4419 20.0716C15.8044 20.0716 20.0669 15.8091 20.0669 10.4466C20.0669 5.08409 15.8044 0.821594 10.4419 0.821594ZM14.1544 15.2591L10.4419 11.5466L6.72936 15.2591L5.62936 14.1591L9.34186 10.4466L5.62936 6.73409L6.72936 5.63409L10.4419 9.34659L14.1544 5.63409L15.2544 6.73409L11.5419 10.4466L15.2544 14.1591L14.1544 15.2591Z'
        fill='currentColor'
      />
    </svg>
  )
}
