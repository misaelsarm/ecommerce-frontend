import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import styles from '@/styles/ProductDetails.module.scss'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import Link from 'next/link'

//import useFileUpload from '@/hooks/useFileUpload'
import { AttributeInterface, CartInterface, ProductInterface } from '@/interfaces'
import Notification from '@/components/online-store/Notification'
import Modal from '@/components/common/Modal/Modal'
import { makeRequest } from '@/utils/makeRequest'
import { Layout } from '@/components/online-store/Layout'
import { createServerSideFetcher } from '@/utils/serverSideFetcher'
import Page from '@/components/common/Page/Page'
import { RenderAttribute } from '@/components/RenderAttribute'
import ProductGallery from '@/components/online-store/ProductGallery/ProductGallery'

interface Props {
  product: ProductInterface,
  error?: {
    message: string
    error: number
  }
}

const ProductDetailsPage = ({ product }: Props) => {

  const { handleSubmit, register, formState: { errors }, control } = useForm({
    defaultValues: {
      attributes: product.attributes.map(attr => ({
        ...attr,
        value: ''
        //values: '',
      })),
    }
  })

  const images = product.images

  const [loading, setLoading] = useState(false)

  const [notificationVisible, setNotificationVisible] = useState(false)

  const [title, setTitle] = useState('')

  const [line1, setLine1] = useState('Línea 1')
  const [line2, setLine2] = useState('Línea 2')

  const [font1, setFont1] = useState<any>()
  const [font2, setFont2] = useState<any>()

  const discountStyles = {
    textDecoration: 'line-through',
    color: 'gray',
    fontWeight: 'normal'
  }

  const { fields } = useFieldArray({
    control,
    name: 'attributes', // Field array name
  });

  const onSubmit = async (data: any) => {

    const mensajeEnGlobo = {
      _id: uuidv4(),
      longName: 'Mensaje en globo',
      shortName: 'Mensaje en globo',
      value: `${line1}(${font1?.value}) ${line2}(${font2?.value})`,
    };


    // Filter attributes to exclude 'Mensaje en globo'
    let finalAttributes = data.attributes.filter(
      (item: any) => item.shortName !== 'Mensaje en globo'
    );

    if (product.attributes.some(attr => attr.shortName === 'Mensaje en globo')) {
      finalAttributes = [mensajeEnGlobo, ...finalAttributes];
    }

    const cartId = localStorage.getItem('cartId');

    const productAdded = {
      ...product,
      attributes: finalAttributes.map((attr: any) => ({
        id: attr._id,
        longName: attr.longName,
        shortName: attr.shortName,
        values: attr.value?.value || attr.value,
      })),
      cartItemId: uuidv4(),
      cartId,
      productId: product._id,
    };

    setLoading(true)
    try {
      const cartData = await makeRequest('post', '/api/cart', productAdded)

      const cart = cartData.cart

      if (cartId !== cart._id) {
        localStorage.setItem('cartId', cart._id)
      }
      setNotificationVisible(true)
      setTitle('Agregado al carrito')
      setLoading(false)
    } catch (error: any) {
      console.log({ error })
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

  return <>
    <div className={styles.productDetails}>

      <div className={styles.top}>
        <div className={styles.left}>
          <ProductGallery
            images={images}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.info}>
            <h1>{product.name}</h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {
                product.discount?.hasDiscount &&
                <span style={{ marginBottom: 5 }}>${product.discount?.discountValue && product.price - product.discount?.discountValue} MXN</span>
              }
              {
                product.soldOut ? 'Agotado' :
                  <span
                    style={
                      product.discount?.hasDiscount ? discountStyles : undefined
                    }
                  >${product.price} MXN</span>
              }
            </div>

          </div>

          <div className={styles.description}>
            <span>{product.description}</span>
          </div>

          {
            product.isCustomizable &&
            <div className={styles.customization}>
              <h2>Personaliza tu producto</h2>
              <div className={styles.attributes}>
                {
                  fields.map((attribute, index) => (
                    <RenderAttribute
                      line1={line1}
                      setLine1={setLine1}
                      line2={line2}
                      setLine2={setLine2}
                      font1={font1}
                      setFont1={setFont1}
                      font2={font2}
                      setFont2={setFont2}
                      key={attribute._id}
                      attribute={attribute}
                      control={control}
                      errors={errors?.attributes?.[index]?.value?.message}
                      index={index}
                      register={register}
                      productIndex={0}
                    />
                  ))
                }
              </div>
            </div>
          }
          <div className={styles.actions}>
            {
              product.active && !product.soldOut &&
              <button
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
                className='btn btn-primary btn-block'>
                {
                  loading ? 'Agregando...' : 'Agregar al carrito'
                }
              </button>
            }

            {
              product.active && product.soldOut &&

              'Agotado'
            }

            {
              !product.active &&
              'Este producto ya no esta disponible.'
            }
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.specs}>
          <span>{product.specs}</span>
        </div>
        <div className={styles.shipping}>
          <h2>IMPORTANTE</h2>
          <div>
            <span>Por la naturaleza de nuestros productos, la garantía esta sujeta a revisión ya que algunos son perecederos o pueden ser dañados por razones externas a Globemily.</span>
          </div>
          <div>
            <span>
              <span>Una vez entregado el regalo en perfectas condiciones, no hay cambios ni devoluciones.
              </span>
            </span>
          </div>

        </div>
      </div>
    </div>
    <Notification
      title={title}
      product={product}
      visible={notificationVisible}
      onClose={() => {
        setNotificationVisible(false)
      }}
    />
  </>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  return createServerSideFetcher(context, {
    endpoint: '/api/public/products/:code',
    dataKey: 'product',
    propKey: 'product',
    paramKey: 'code',
  })
}

ProductDetailsPage.getLayout = function getLayout(page: ReactElement) {

  const { name, keywords, images, description } = page.props.product

  return (
    <Layout
      title={name}
      keywords={keywords}
      image={images[0]}
      description={description}
    >
      {page}
    </Layout>
  );
};

export default ProductDetailsPage