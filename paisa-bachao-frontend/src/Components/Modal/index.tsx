import './index.scss'

import { MutableRefObject, ReactElement, useEffect, useRef } from 'react'

import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

const modalRoot = document.getElementById('modal')
const Modal = ({
  children,
  handleRequestClose,
}: {
  children: ReactElement | null
  handleRequestClose: () => void
}) => {
  const elRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  if (!elRef.current) {
    elRef.current = document.createElement('div')
  }

  useEffect(() => {
    if (!modalRoot || !elRef.current) return
    modalRoot?.appendChild(elRef.current)
    return () => {
      if (elRef.current) modalRoot.removeChild(elRef.current)
    }
  })

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='modal-background'
      onClick={handleRequestClose}
    >
      <motion.div
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className='modal-container'
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    elRef.current,
  )
}

export default Modal
