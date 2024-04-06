import { SvgIconProps } from '@/types/icon'

type HeartIconProps = SvgIconProps & {
  heratOutLineStyle?: string
  heratInLineStyle?: string
}

export default function HeartLikesIcon({
  width = 24,
  height = 24,
  className = '',
  heratOutLineStyle = '',
  heratInLineStyle = '',
}: HeartIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 110 110'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        className={heratOutLineStyle}
        d='M73,24a23.78,23.78,0,0,0-15.89,6.19,3.14,3.14,0,0,1-4.18,0A23.81,23.81,0,0,0,37,24a22,22,0,0,0-22,22c0,16.67,19.64,32.82,25.11,37.93,2.84,2.65,6.15,5.64,8.92,8.13a8.9,8.9,0,0,0,11.9,0c2.77-2.49,6.07-5.48,8.91-8.13C75.37,78.81,95,62.66,95,46A22,22,0,0,0,73,24Z'
        fill='currentColor'
      ></path>
      <path
        className={heratInLineStyle}
        d='M66.25,76.42c-.71.64-1.32,1.2-1.82,1.67-2.51,2.33-5.39,5-7.94,7.25a2.21,2.21,0,0,1-3,0C51,83,48.1,80.42,45.59,78.09c-.5-.47-1.12-1-1.82-1.67C38.09,71.29,23,57.67,23,46A14,14,0,0,1,37,32a15.92,15.92,0,0,1,11.65,5.23l4.73,5a2.2,2.2,0,0,0,3.23,0l4.72-5A16.06,16.06,0,0,1,73,32,14,14,0,0,1,87,46C87,57.67,71.93,71.29,66.25,76.42Z'
        fill='currentColor'
      ></path>
    </svg>
  )
}
