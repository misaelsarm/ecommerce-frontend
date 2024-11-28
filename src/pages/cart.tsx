import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CartInterface, CartItemInterface } from '@/interfaces'
import { makeRequest } from '@/utils/makeRequest'
import styles from '@/styles/Cart.module.scss'
import CartItem from '@/components/common/CartItem'

const CartComponent = () => {

    const [cart, setCart] = useState({} as CartInterface)

    const [items, setItems] = useState<CartItemInterface[]>([])

    const [subTotal, setSubTotal] = useState(0)

    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const cartId = localStorage.getItem('cartId')
            if (cartId) {
                const data = await makeRequest('get', `/api/cart/${cartId}`)
                setCart(data.cart)
                setItems(data.items)
                setSubTotal(data.originalTotal)
            }

            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const remove = async (product: CartItemInterface) => {
        const cartId = localStorage.getItem('cartId')
        const data = {
            cartItemId: product.cartItemId,
            cartId
        }
        try {
            await makeRequest('post', '/api/cart/remove', data)
            await fetchData()
        } catch (error) {
            alert('error')
        }
    }

    if (loading) return <div className={styles.cart}></div>

    return (
        <>
            <div className={styles.cart}>
                {
                    items.length === 0 ?
                        <div className={styles.empty}>
                            <div className={styles.image}>
                                <Image
                                    src='/cart.svg'
                                    alt=''
                                    width={100}
                                    height={100}
                                    objectFit='contain'
                                />
                            </div>
                            <span>Tu carrito está vacío.</span>

                            <Link className="btn btn-pink" href='/products'>
                                Explorar tienda
                            </Link>
                        </div> :
                        <>
                            <h2>Carrito</h2>
                            <div className={styles.items}>
                                {
                                    items.map(product => (
                                        <CartItem
                                            showAttributes
                                            onRemove={(e) => {
                                                e.preventDefault()
                                                remove(product)
                                            }}
                                            key={product.cartItemId}
                                            {...product}
                                        />
                                    ))
                                }
                            </div>
                            <div className={styles.bottom}>
                                <div>
                                    <span>Subtotal</span>
                                    ${subTotal} MXN
                                    {/*  <span>${renderSubtotal(cart)} MXN</span> */}
                                </div>
                                <Link className='btn btn-black btn-block' href={`/checkout/${cart._id}`}>
                                    Checkout
                                </Link>
                            </div>
                        </>
                }
            </div>
            {/* <div className="container-white">
                <Related title='Tambien te podría interesar...' />
            </div> */}
        </>
    )
}

export default CartComponent
