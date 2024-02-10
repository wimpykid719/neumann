'use client'

import Toast from '@/components/common/Toast'
import { createContext, useContext, useRef, useState } from 'react'

type ToastContext = {
  showToast: (message: string, type: ToastType) => void
  closeToast: () => void
}

type ToastType = 'success' | 'error'

export const ToastContext = createContext<ToastContext>({
  showToast: () => {},
  closeToast: () => {},
})

export const useToast = () => {
  return useContext(ToastContext)
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<string>('')
  const [isShowToast, setShowToast] = useState<boolean>(false)
  const [toastType, setToastType] = useState<ToastType>('success')
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const showToast = (message: string, type: ToastType) => {
    // すでに実行されているsetTimeout()をキャンセルする
    if (timer.current) {
      clearTimeout(timer.current)
    }

    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    timer.current = setTimeout(() => {
      setShowToast(false)
    }, 5000)
  }

  const closeToast = () => {
    // すでに実行されているsetTimeout()をキャンセルする
    clearTimeout(timer.current)
    setShowToast(false)
  }

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      <Toast isShowToast={isShowToast} message={toastMessage} toastType={toastType} closeToast={closeToast} />
      {children}
    </ToastContext.Provider>
  )
}
