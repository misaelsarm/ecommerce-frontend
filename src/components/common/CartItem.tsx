import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/CartItem.module.scss'
import { AttributeInterface, CartItemInterface } from '@/interfaces'


interface Props extends CartItemInterface {
  onRemove?: (e?: any) => void,
  showAttributes: boolean,
  attributeList?: any,
  original?: number,
  wasCustomized?: boolean
}

const CartItem = ({ name, description, price, images, code, onRemove, hasDiscount, discountValue, showAttributes, attributes, attributeList, original }: Props) => {

  console.log({attributeList, attributes})

  const [attributeItems, setAttributeItems] = useState<AttributeInterface[]>([])

  console.log({attributeItems})

  useEffect(() => {
    if (attributes.length === 0) {
      setAttributeItems(attributeList)
    } else {
      setAttributeItems(attributes)
    }
  }, [attributeList, attributes])

  const discount = {
    textDecoration: 'line-through',
    color: 'gray',
    fontWeight: 'normal'
  }

  const isJson = (str: string) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  const renderValues = (values: any[]) => {
    const isArray = Array.isArray(values)

    let attributeValues = []

    if (isArray) {
      attributeValues = values.map(value => (
        <span key={value._id}>{isJson(value) ? JSON.parse(value).label : ''}</span>
      ))
      return attributeValues
    } else if (isJson(values)) {
      return JSON.parse(values).label
    } else {
      return values
    }
  }

  return (
    <Link className={styles.item} href={`/products/${code}`}>
      <div className={styles.image}>
        <Image objectFit='cover' layout='fill' src={images[0]} alt="" />
      </div>
      <div className={styles.info}>
        {
          onRemove &&
          <div
            onClick={onRemove}
            className={styles.remove}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        }
        <div className={styles.title}>
          <span>{name}</span>
        </div>
        {
          showAttributes ?
            <div className={styles.attributes}>
              {
                attributeItems?.map(attribute => (
                  <div key={attribute.shortName} className={styles.attribute}>
                    <span className={styles.name}>{attribute.shortName}</span>
                    {renderValues(attribute.values)}
                  </div>
                ))
              }
            </div> :
            <div className={styles.description}>
              <span>{description}</span>
            </div>
        }
        <div className={styles.price}
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {
            original && (original !== price) && <span style={discount}>$ {original} MXN</span>
          }
          <span
            style={
              hasDiscount ? discount : undefined
            }
          >${price} MXN</span>
          {
            hasDiscount &&
            <span>${discountValue && price - discountValue} MXN</span>
          }
        </div>
      </div>
    </Link>
  )
}

export default CartItem
