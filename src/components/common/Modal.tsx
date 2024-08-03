import React, { CSSProperties, useEffect } from 'react'
import styles from '@/styles/admin/Modal.module.scss'

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

const Modal = ({ title, showButtons = true, onClose, visible, children, onOk, bodyStyle, onCancel, loadingState, style, headerStyle }: Props) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [visible])

  return visible ?
    <div className="modal-root">
      <div className={styles.modalBackdrop} />
      <div className={styles.modalWrap}>
        <div style={{
          width: bodyStyle ? bodyStyle.width : 600,
          ...style
        }} className={styles.modal}>
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
              <button disabled={loadingState} onClick={onOk} className='btn btn-black'>Listo</button>
            </div>
          }
        </div>
      </div>
    </div> :
    null
}

export default Modal
