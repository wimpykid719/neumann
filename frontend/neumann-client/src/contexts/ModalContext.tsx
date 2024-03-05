'use client'

import Modal from '@/components/common/Modal'
import { ReactNode, createContext, useContext, useState } from 'react'

type ModalContext = {
  showModal: (modalDOM: ReactNode) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContext>({
  showModal: () => {},
  closeModal: () => {},
})

export const useModal = () => {
  return useContext(ModalContext)
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isShowModal, setShowModal] = useState<boolean>(false)
  const [modalDOM, setModalDOM] = useState<ReactNode>()

  const showModal = (modalDOM: ReactNode) => {
    setModalDOM(modalDOM)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      <Modal isShowModal={isShowModal} closeModal={closeModal} modalDOM={modalDOM} />
      {children}
    </ModalContext.Provider>
  )
}
