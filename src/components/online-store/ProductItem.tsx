import { ProductInterface } from '@/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from '@/styles/ProductItem.module.scss'

interface Props {
  product: ProductInterface
}

const ProductItem = ({ product }: Props) => {

  const discount = {
    textDecoration: 'line-through',
    color: 'gray',
    fontWeight: 'normal'
  }

  return (
    <Link
      style={{
        opacity: product.soldOut ? '0.5' : 1
      }}
      className={styles.product} href={`/products/${product.code}`} key={product.name}>
      <div className={styles.image}>
        <Image src={product.images[0]} alt='' fill />
      </div>
      <div className={styles.info}>
        <h2>{product.name}</h2>
        {/* <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {
            product.hasDiscount &&
            <span className={styles.price} style={{ marginBottom: 5, color: 'red', fontWeight: 600 }}>${product.discountValue && product.price - product.discountValue} MXN</span>
          }
          <span className={styles.price}
                style={
                  product.hasDiscount ? discount : undefined
                }
              >${product.price.toFixed(2)} MXN</span>
        </div> */}
        {
          product.soldOut ? 'AGOTADO' : <button className='btn btn-black btn-block'>Ver producto</button>
        }
      </div>

    </Link>
  )
}

export default ProductItem