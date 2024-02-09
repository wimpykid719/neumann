'use client'

import { motion } from 'framer-motion'
import ErrorIcon from './icon/ErrorIcon'

type ToastProps = {
  isShowToast: boolean
  message: string
  closeToast: () => void
}

export default function Toast({ isShowToast, message, closeToast }: ToastProps) {
  const variants = {
    visible: { bottom: '2%', opacity: 1, scale: 1 },
    hidden: { opacity: 0, bottom: '-10%', scale: 0.5 },
  }

  return (
    <motion.div
      initial={{ bottom: '-10%', left: '50%', x: '-50%', opacity: 0, position: 'fixed', scale: 0.3 }}
      animate={isShowToast ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ ease: 'easeOut', duration: 0.4 }}
      id='toast-default'
      className='flex items-center max-w-xs sm:max-w-md w-full p-4 text-danger bg-primary bg-opacity-20 rounded-lg shadow border-2 border-primary'
      role='alert'
    >
      <ErrorIcon />
      <div className='ms-3 text-sm font-normal'>{message}</div>
      <button
        type='button'
        className='ms-auto -mx-1.5 -my-1.5 bg-primary bg-opacity-0 text-primary hover:bg-opacity-10 rounded-lg focus:ring-2 focus:ring-primary p-1.5 inline-flex items-center justify-center h-8 w-8'
        data-dismiss-target='#toast-default'
        aria-label='Close'
        onClick={closeToast}
      >
        <span className='sr-only'>Close</span>
        <svg className='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
          />
        </svg>
      </button>
    </motion.div>
  )
}
