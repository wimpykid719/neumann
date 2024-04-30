'use client'

import { replaceNewlines } from '@/utils/replaceNewlines'
import { ReactNode, useRef } from 'react'

type TooltipProps = {
  children: ReactNode
  message: string
  placement?: string
}

export default function Tooltip({ children, message, placement = 'top' }: TooltipProps) {
  const placementStyles = (placement: TooltipProps['placement']) => {
    const DEFAULT_PLACEMENT_STYLES = 'bottom-full mb-2'

    switch (placement) {
      case 'top':
        return DEFAULT_PLACEMENT_STYLES
      case 'bottom':
        return 'top-full mt-2'
      default:
        return DEFAULT_PLACEMENT_STYLES
    }
  }

  const ref = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!ref.current) return
    ref.current.style.opacity = '1'
    ref.current.style.visibility = 'visible'
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.opacity = '0'
    ref.current.style.visibility = 'hidden'
  }

  return (
    <div className='flex relative items-center'>
      <div
        className={`
          ${placementStyles(placement)}
          min-w-40
          flex absolute
          left-1/2
          invisible z-10
          items-center
          p-3 mx-auto
          text-xs whitespace-pre-wrap
          rounded-lg transition-all
          duration-150 transform
          -translate-x-1/2
          text-gray-50
          bg-black
        `}
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {replaceNewlines(message)}
      </div>
      <div className='w-full' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </div>
  )
}
