import { toastStatus } from '@/utils/toast'

export type ToastType = (typeof toastStatus)[keyof typeof toastStatus]
