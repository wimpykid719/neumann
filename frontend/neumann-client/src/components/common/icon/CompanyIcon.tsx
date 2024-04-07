import { SvgIconProps } from '@/types/icon'

export default function CompanyIcon({ width = 24, height = 24, className = '' }: SvgIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 18 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M16.5234 14.0888H15.1953V6.83876C15.1953 6.63985 15.1114 6.44908 14.9619 6.30843C14.8125 6.16778 14.6098 6.08876 14.3984 6.08876H9.88281V2.83876C9.88303 2.70289 9.84402 2.56952 9.76997 2.4529C9.69591 2.33627 9.58958 2.24077 9.46234 2.17659C9.3351 2.11241 9.19173 2.08197 9.04754 2.08852C8.90335 2.09506 8.76376 2.13835 8.64367 2.21376L3.33117 5.54688C3.22192 5.61549 3.13237 5.70845 3.07051 5.81749C3.00864 5.92653 2.97637 6.04827 2.97656 6.17188V14.0888H1.64844C1.57799 14.0888 1.51043 14.1151 1.46061 14.162C1.4108 14.2089 1.38281 14.2725 1.38281 14.3388C1.38281 14.4051 1.4108 14.4687 1.46061 14.5155C1.51043 14.5624 1.57799 14.5888 1.64844 14.5888H16.5234C16.5939 14.5888 16.6614 14.5624 16.7113 14.5155C16.7611 14.4687 16.7891 14.4051 16.7891 14.3388C16.7891 14.2725 16.7611 14.2089 16.7113 14.162C16.6614 14.1151 16.5939 14.0888 16.5234 14.0888ZM14.3984 6.58876C14.4689 6.58876 14.5364 6.6151 14.5863 6.66198C14.6361 6.70887 14.6641 6.77246 14.6641 6.83876V14.0888H9.88281V6.58876H14.3984ZM3.50781 6.17251C3.50767 6.13123 3.5184 6.09057 3.53902 6.05414C3.55965 6.01772 3.58953 5.98667 3.62602 5.96376L8.93852 2.63063C8.97853 2.60551 9.02504 2.59108 9.07308 2.58889C9.12113 2.5867 9.1689 2.59683 9.21131 2.6182C9.25371 2.63956 9.28916 2.67137 9.31386 2.71021C9.33856 2.74906 9.35159 2.79349 9.35156 2.83876V14.0888H3.50781V6.17251ZM7.75781 7.83876V8.83876C7.75781 8.90506 7.72983 8.96865 7.68001 9.01554C7.6302 9.06242 7.56264 9.08876 7.49219 9.08876C7.42174 9.08876 7.35418 9.06242 7.30436 9.01554C7.25455 8.96865 7.22656 8.90506 7.22656 8.83876V7.83876C7.22656 7.77246 7.25455 7.70887 7.30436 7.66198C7.35418 7.6151 7.42174 7.58876 7.49219 7.58876C7.56264 7.58876 7.6302 7.6151 7.68001 7.66198C7.72983 7.70887 7.75781 7.77246 7.75781 7.83876ZM5.63281 7.83876V8.83876C5.63281 8.90506 5.60483 8.96865 5.55501 9.01554C5.5052 9.06242 5.43764 9.08876 5.36719 9.08876C5.29674 9.08876 5.22918 9.06242 5.17936 9.01554C5.12955 8.96865 5.10156 8.90506 5.10156 8.83876V7.83876C5.10156 7.77246 5.12955 7.70887 5.17936 7.66198C5.22918 7.6151 5.29674 7.58876 5.36719 7.58876C5.43764 7.58876 5.5052 7.6151 5.55501 7.66198C5.60483 7.70887 5.63281 7.77246 5.63281 7.83876ZM5.63281 11.3388V12.3388C5.63281 12.4051 5.60483 12.4687 5.55501 12.5155C5.5052 12.5624 5.43764 12.5888 5.36719 12.5888C5.29674 12.5888 5.22918 12.5624 5.17936 12.5155C5.12955 12.4687 5.10156 12.4051 5.10156 12.3388V11.3388C5.10156 11.2725 5.12955 11.2089 5.17936 11.162C5.22918 11.1151 5.29674 11.0888 5.36719 11.0888C5.43764 11.0888 5.5052 11.1151 5.55501 11.162C5.60483 11.2089 5.63281 11.2725 5.63281 11.3388ZM7.75781 11.3388V12.3388C7.75781 12.4051 7.72983 12.4687 7.68001 12.5155C7.6302 12.5624 7.56264 12.5888 7.49219 12.5888C7.42174 12.5888 7.35418 12.5624 7.30436 12.5155C7.25455 12.4687 7.22656 12.4051 7.22656 12.3388V11.3388C7.22656 11.2725 7.25455 11.2089 7.30436 11.162C7.35418 11.1151 7.42174 11.0888 7.49219 11.0888C7.56264 11.0888 7.6302 11.1151 7.68001 11.162C7.72983 11.2089 7.75781 11.2725 7.75781 11.3388Z'
        fill='currentColor'
      />
    </svg>
  )
}