'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect, useRef } from 'react'

type ModalProps = {
  isShowModal: boolean
  closeModal: () => void
  modalDOM: ReactNode
}

export default function Modal({ isShowModal, closeModal, modalDOM }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const documentClickHandler = useRef<(e: MouseEvent) => void>(() => {})

  useEffect(() => {
    if (isShowModal) document.addEventListener('click', documentClickHandler.current)

    documentClickHandler.current = e => {
      if (e.target === null) return
      // メニューの内側をクリックした場合何もしない、as Nodeに関してはクリックされる要素の型を推論するのは難しいため
      if (modalRef.current?.contains(e.target as Node)) return

      closeModal()
      removeDocumentClickHandler()
    }
  }, [isShowModal])

  const removeDocumentClickHandler = () => {
    document.removeEventListener('click', documentClickHandler.current)
  }

  return (
    <AnimatePresence>
      {isShowModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
          id='modal-background'
          className={
            'bg-gray-900 bg-opacity-80\
              fixed flex top-0 right-0 left-0 z-50 justify-center items-center\
              w-full md:inset-0 max-h-full\
              bg-backdrop backdrop-filter backdrop-blur-sm\
            '
          }
        >
          <motion.div
            data-testid='modal'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
            id='modal-default'
            className={'relative p-4 max-w-2xl flex justify-center'}
            role='dialog'
            aria-modal='true'
            aria-labelledby='dialogTitle'
            aria-describedby='dialogDesc'
            ref={modalRef}
          >
            {modalDOM}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
