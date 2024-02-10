import { SvgIconProps } from '@/types/icon'

export default function ErrorIcon({ width = 22, height = 22, className = '' }: SvgIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 22 22'
      fill='#fff'
      xmlns='http://www.w3.org/2000/svg'
    >
      <mask
        id='mask0_1257_269'
        style={{ maskType: 'luminance' }}
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='22'
        height='22'
      >
        <path
          d='M11 20.1667C12.204 20.1682 13.3964 19.9318 14.5088 19.471C15.6212 19.0103 16.6315 18.3342 17.4817 17.4817C18.3342 16.6315 19.0103 15.6212 19.471 14.5088C19.9318 13.3964 20.1682 12.204 20.1667 11C20.1682 9.79598 19.9318 8.60354 19.471 7.49118C19.0102 6.37883 18.3342 5.36849 17.4817 4.51824C16.6315 3.66575 15.6212 2.98969 14.5088 2.52893C13.3964 2.06816 12.204 1.83176 11 1.83332C9.79598 1.83179 8.60354 2.06819 7.49118 2.52896C6.37883 2.98973 5.36849 3.66577 4.51824 4.51824C3.66577 5.36849 2.98973 6.37883 2.52896 7.49118C2.06819 8.60354 1.83179 9.79598 1.83332 11C1.83176 12.204 2.06816 13.3964 2.52893 14.5088C2.98969 15.6212 3.66575 16.6315 4.51824 17.4817C5.36849 18.3342 6.37883 19.0102 7.49118 19.471C8.60354 19.9318 9.79598 20.1682 11 20.1667Z'
          fill='white'
          stroke='white'
          strokeWidth='1.83333'
          strokeLinejoin='round'
        />
        <path
          d='M7.33331 11L10.0833 13.75L15.5833 8.25'
          stroke='black'
          strokeWidth='1.83333'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </mask>
      <g mask='url(#mask0_1257_269)'>
        <path d='M0 0H22V22H0V0Z' fill='currentColor' />
      </g>
    </svg>
  )
}
