'use client'

import Tooltip from '@/components/common/Tooltip'
import AmazonIcon from '@/components/common/icon/AamazonIcon'
import tooltip from '@/text/tooltip.json'
import { BookDetail } from '@/types/book'
import { useEffect, useState } from 'react'

type AssociateLinkProps = {
  price: BookDetail['price_delimited']
  associate_url: BookDetail['associate_url']
}

const ANIMATE_TIME = 1500 // アニメーションの継続時間 (2秒)
const TRIGGER_TIME = 30000 // アニメーションのトリガー間隔 (30秒)

export default function AssociateLink({ price, associate_url }: AssociateLinkProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const triggerAnimation = () => {
      setAnimate(true)
      setTimeout(() => setAnimate(false), ANIMATE_TIME)
    }

    triggerAnimation()

    const intervalId = setInterval(triggerAnimation, TRIGGER_TIME)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Tooltip message={tooltip.amazonAssociate}>
      <a
        className={`
          block text-center
          py-1 w-full h-8
          sub-text-color
          rounded-lg mb-3
          bg-[length:800%_auto]
          bg-gradient-shine-primary
          ${animate && 'animate-shine'}
        `}
        href={associate_url}
      >
        <div className='flex justify-center items-center'>
          <div className='mr-2'>
            <AmazonIcon width={18} height={18} />
          </div>
          <div>
            <span className='text-xs mr-1'>¥</span>
            {price}
          </div>
        </div>
      </a>
    </Tooltip>
  )
}
