import { SvgIconProps } from '@/types/icon'

export default function BizRankIcon({ width = 45, height = 45, className = '' }: SvgIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 45 45'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g style={{ isolation: 'isolate' }}>
        <g style={{ mixBlendMode: 'darken' }}>
          <path
            d='M26.4923 36.1876L40.2431 32.6465C40.9274 32.4703 41.5984 32.2336 42.2073 31.875C44.9055 30.2855 45.4628 28.6929 45.4628 27.3074L45.4627 7.87454C45.4627 7.36347 45.4451 6.84504 45.277 6.3624C44.2606 3.44432 40.243 2.04132 38.9008 2.19612C37.4491 2.36354 29.0764 4.58606 28.9765 4.6287C28.8766 4.67134 27.1223 5.38162 25.3054 4.94025C23.4886 4.49888 20.4598 1.31578 19.7923 0.42271C19.2407 -0.315365 18.6638 0.808369 18.6638 1.72983L18.6638 29.6164C18.6638 30.2632 18.7104 30.9142 18.8964 31.5337C20.2939 36.188 24.4657 36.6041 26.4923 36.1876Z'
            fill='#FF0211'
          />
        </g>
        <g style={{ mixBlendMode: 'darken' }}>
          <path
            d='M19.4332 8.81237L5.68244 12.3535C4.99814 12.5297 4.32712 12.7664 3.71828 13.125C1.02 14.7145 0.462769 16.3071 0.462769 17.6926L0.462832 37.1255C0.462833 37.6365 0.48047 38.155 0.64857 38.6376C1.66491 41.5557 5.68252 42.9587 7.02472 42.8039C8.4764 42.6365 16.8491 40.4139 16.949 40.3713C17.0489 40.3287 18.8032 39.6184 20.6201 40.0597C22.437 40.5011 25.4657 43.6842 26.1332 44.5773C26.6849 45.3154 27.2618 44.1916 27.2618 43.2702V15.3836C27.2618 14.7368 27.2152 14.0858 27.0292 13.4663C25.6317 8.81204 21.4598 8.39586 19.4332 8.81237Z'
            fill='#6ECEF7'
            fill-opacity='0.9'
          />
        </g>
      </g>
    </svg>
  )
}