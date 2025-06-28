import React, { useEffect, useState } from 'react'
import styles from '@/styles/Notification.module.scss'
import Link from 'next/link'
import { ProductInterface } from '@/interfaces'
import CartItem from '../common/CartItem'


interface Props {
  visible: boolean
  onClose: () => void,
  product: ProductInterface,
  title: string
}

const Notification = ({ visible, onClose, product, title }: Props) => {

  const [cartId, setCartId] = useState('')

  useEffect(() => {
    setCartId(localStorage.getItem('cartId') || '')
  }, [])

  return (
    visible ? <>
      <div onClick={onClose} className={styles.notificationBackdrop}></div>
      <div className={styles.notification} >
        <div className={styles.header}>
          <div className={styles.left}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{title}</span>
          </div>
          <div onClick={onClose} className={styles.right}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className={styles.content}>
          <CartItem
            {...product}
            showAttributes={false}
          />
        </div>

        <div className={styles.actions}>
          <Link className='btn btn-block btn-black' href={`/checkout/${cartId || localStorage.getItem('cartId')}`}>
            Checkout
          </Link>
          <Link className='btn btn-block btn-white' href='/cart'>
            Ver carrito
          </Link>
        </div>
      </div>
    </> : null
  )
}

export default Notification
