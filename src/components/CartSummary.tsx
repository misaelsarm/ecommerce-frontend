import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import styles from '../styles/CartSummary.module.scss'
import { CartInterface, CartItemInterface, DiscountInterface } from '@/interfaces'
import { makeRequest } from '@/utils/makeRequest'
import CartItem from './common/CartItem'

interface Props {
  cart: CartInterface,
  shippingFee: number,
  discount: DiscountInterface,
  fetchCart: any,
  items: CartItemInterface[]
  originalTotal: number;
  total: number;
  discountedAmount: number;
}

const CartSummary: FC<Props> = ({ cart, fetchCart, shippingFee, discount, items, originalTotal,
  total,
  discountedAmount
}) => {

  const [summary, setSummary] = useState(true)

  const [name, setName] = useState('');

  const [cartDiscount, setcartDiscount] = useState<DiscountInterface | undefined>(discount);

  useEffect(() => {
    setcartDiscount(discount)
  }, [discount])

  const applyDiscount = async () => {
    try {
      const data = await makeRequest('post', '/api/discounts/apply', {
        cartId: cart._id,
        name
      })
      setcartDiscount(data.discount)
      fetchCart()
      toast.success("Descuento aplicado")
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  const removeDiscount = async () => {
    try {
      await makeRequest('post', '/api/discounts/remove', {
        cartId: cart._id,
        name
      })
      toast.success('Descuento removido')
      setcartDiscount(undefined)
      fetchCart()
    } catch (error: any) {
      console.log({ error })
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className={styles.summary}>
      <div onClick={() => {
        setSummary(!summary)
      }} className={styles.header}>
        <div>
          <span>Resumen de compra</span>
          <svg
            style={{
              transform: summary ? 'rotate(180deg)' : ''
            }}
            xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <span>${originalTotal} MXN</span>
      </div>
      {
        summary &&
        <>
          <div className={styles.content}>
            {
              items.map(product => (
                <CartItem
                  key={product.cartItemId}
                  {...product}
                  showAttributes
                // onRemove={(e)=>{
                //   remove(product)
                //   e.preventDefault()
                //   fetchCart()
                // }}
                />
              ))
            }
          </div>
          <div className={styles.details}>
            {
              !cartDiscount &&
              <div className={styles.discount}>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                  placeholder='Codigo de descuento'
                  className='input'
                  type="text"
                  name='discount'
                  autoComplete='off'
                />
                <button onClick={applyDiscount} className='btn btn-black'>Aplicar</button>
              </div>
            }
            <div className={styles.item}>
              <span>Subtotal de articulos</span>

              <span>${originalTotal} MXN</span>
            </div>
            <div className={styles.item}>
              <span>Envío</span>
              {
                originalTotal > 999 ? 'GRATIS' : '$100 MXN'
              }
            </div>
            {
              cartDiscount &&
              <>
                <div className={styles.item}>
                  <span>Código de descuento</span>
                  <span>{cartDiscount.name}</span>
                  <svg
                    onClick={() => {
                      removeDiscount()
                    }}
                    xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div className={styles.item}>
                  <span>  Descuentos</span>
                  <span>${discountedAmount} MXN</span>
                  {/* <span>{cartDiscount.type === 'percentage' ?
                    `${cartDiscount?.value} %` : `$${cartDiscount?.value} MXN`
                  }</span> */}
                </div>
              </>
            }
            <div className={styles.item}>
              <span>Total</span>
              <span>${total + shippingFee} MXN</span>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default CartSummary
