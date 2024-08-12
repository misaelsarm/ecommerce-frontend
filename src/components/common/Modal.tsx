import React, { CSSProperties, useEffect } from 'react'
import styles from '@/styles/admin/Modal.module.scss'
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  visible: boolean,
  title?: string,
  onClose?: () => void,
  onOk?: () => void,
  onCancel?: () => void,
  children: JSX.Element,
  header?: JSX.Element,
  bodyStyle?: CSSProperties,
  loadingState?: boolean,
  showButtons?: boolean,
  style?: CSSProperties
  headerStyle?: CSSProperties
}

const modalVariants = {
  hidden: {
    transform: 'translate(-50%,0%)',
    top: '100%',
    left: '50%',
    transition: { duration: 0.3 }

  },
  visible: {
    transform: 'translate(-50%,-50%)',
    top: '50%',
    left: '50%',
    transition: { duration: 0.3 }
  },
  exit: {
    transform: 'translate(-50%,0%)',
    top: '100%',
    left: '50%',
    transition: { duration: 0.3 }

  },
};

const backdropVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.3 }
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// initial={{ transform: 'translate(-50%,0%)', top: '100%', left: '50%' }}
//               animate={{ transform: 'translate(-50%,-50%)', top: '50%', left: '50%' }}
//               exit={{ transform: 'translate(-50%,0%)', top: '100%', left: '50%' }}
//               transition={{ duration: 5 }}



const Modal = ({ title, showButtons = true, onClose, visible, children, onOk, bodyStyle, onCancel, loadingState, style, headerStyle }: Props) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [visible])

  return (
    <AnimatePresence>
      {
        visible ?
          <div className="modal-root">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              className={styles.modalBackdrop}
              onClick={() => {
                if (onClose) {
                  onClose()
                }
              }}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              style={{
                width: bodyStyle ? bodyStyle.width : 600,
                ...style
              }}
              className={styles.modal
              }>
              <div
                style={{
                  ...headerStyle
                }}
                className={styles.modalHeader}>
                <h2>{title}</h2>
                <div onClick={() => {
                  if (loadingState) {
                    return
                  }
                  if (onClose) {
                    onClose()
                  }
                }} className={styles.modalClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div style={{ ...bodyStyle }} className={styles.modalBody}>
                {children}
              </div>
              {
                showButtons &&
                <div className={styles.modalFooter}>
                  <button disabled={loadingState} onClick={onCancel} className='btn'>Cancelar</button>
                  <button disabled={loadingState} onClick={onOk} className='btn btn-black'>Aceptar</button>
                </div>
              }
            </motion.div>

          </div> :
          null
      }
    </AnimatePresence>
  )
}

export default Modal
