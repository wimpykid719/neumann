import { SvgIconProps } from '@/types/icon'

export default function YouTubeIcon({ width = 24, height = 24, className = '' }: SvgIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.5 9.01123L7.875 10.5112V7.51123L10.5 9.01123Z'
        fill='currentColor'
        stroke='currentColor'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M1.5 9.54228V8.48028C1.5 6.30903 1.5 5.22303 2.17875 4.52478C2.85825 3.82578 3.92775 3.79578 6.066 3.73503C7.0785 3.70653 8.1135 3.68628 9 3.68628C9.88575 3.68628 10.9207 3.70653 11.934 3.73503C14.0722 3.79578 15.1417 3.82578 15.8205 4.52478C16.5 5.22303 16.5 6.30978 16.5 8.48028V9.54153C16.5 11.7135 16.5 12.7988 15.8212 13.4978C15.1417 14.196 14.073 14.2268 11.934 14.2868C10.9215 14.316 9.8865 14.3363 9 14.3363C8.02182 14.3333 7.04372 14.3168 6.066 14.2868C3.92775 14.2268 2.85825 14.1968 2.17875 13.4978C1.5 12.7988 1.5 11.7128 1.5 9.54228Z'
        stroke='currentColor'
        stroke-width='1.5'
      />
    </svg>
  )
}
