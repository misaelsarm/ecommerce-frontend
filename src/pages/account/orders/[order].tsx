import Image from "next/image";
import React, { ReactElement } from 'react';
import { OrderInterface } from "@/interfaces";
import { Layout } from "@/components/online-store/Layout";
import { makeRequest } from "@/utils/makeRequest";
import { formatCurrency } from "@/utils/formatCurrency";
import moment from "moment";
import AccountLayout from "@/components/online-store/AccountLayout";
import { GetServerSideProps } from "next";
import { getServerSideToken } from "@/utils/getServerSideToken";
import styles from '@/styles/online-store/account/OrderDetails.module.scss'
import { orderPaymentMethodMap, orderStatusColorMap } from "@/utils/mappings";
import { CartItem, Chip } from "@/components/common";

interface Props {
  order: OrderInterface
  error: {
    error: number,
    message: string
  }
}

const AccountOrderDetailsPage = ({ order, error }: Props) => {

  //const step = order?.status === 'Nuevo' ? 0 : steps.indexOf(order?.status)

  return (

    error ? <div style={{
      height: '50dvh'
    }}>
      <h2>{error.message}</h2>
    </div> : <>
      <div className={styles.orderDetails}>

        <div className={styles.header}>
          <div className={styles.number}>
            <h3>  Pedido No. {order.number}</h3>
          </div>
          {/* <div className={styles.progress}>
            <ProgressTracker currentStep={step} />
          </div> */}
        </div>
        <div className={styles.content}>
          <div className={`${styles.card} ${styles.info}`}>
            <div className={styles.cardHeader}>
              <h4>Información del pedido</h4>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardItem}>
                <h4>Numero de pedido</h4>
                <span>{order.number}</span>
              </div>
              <div className={styles.cardItem}>
                <h4>Estado</h4>
                <Chip color={orderStatusColorMap[order.status]} text={order.status} />
              </div>
              <div className={styles.cardItem}>
                <h4>Fecha de entrega</h4>
                <span>{moment(order.deliveryDate, 'YYYY-MM-DD').format('ll')}</span>
              </div>
              {
                order.shippingType !== 'pickUp' &&
                <>

                  <div className={styles.cardItem}>
                    <h4>Dirección de entrega</h4>
                    <span>{order.shippingAddress?.street}, {order.shippingAddress.colonia}, {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</span>
                  </div>
                  <div className={styles.cardItem}>
                    <h4>Instrucciones de entrega</h4>
                    {
                      <span>{order.shippingAddress.deliveryInstructions}</span>
                    }
                  </div>
                  <div className={styles.cardItem}>
                    <h4>Tipo de edificio</h4>
                    {
                      <span>{order.shippingAddress.apartment}</span>
                    }
                  </div>
                </>
              }
              <div className={styles.cardItem}>
                <h4>Información de cliente / quien envía</h4>
                <span>{order.name}</span>
                <span>{order.email}</span>
                <span>{order.phone}</span>
              </div>
              {
                order.shippingType !== 'pickUp' &&
                <>
                  <div className={styles.cardItem}>
                    <h4>Información de quien recibe</h4>
                    <span>{order.receiverName}</span>
                    <span>{order.receiverPhone}</span>
                  </div>
                </>
              }

              <div className={styles.cardItem}>
                <h4>Método de pago</h4>
                <Chip text={orderPaymentMethodMap[order.paymentMethod]} />
              </div>

              <div className={styles.cardItem}>
                <h4>Fecha de compra</h4>
                <span>{moment(order.createdAt).format('lll')}</span>
              </div>

              {/* <div className={styles.cardItem}>
                <h4>Tipo de envío</h4>
                <Chip text={orderShippingTypeMap[order.shippingType]} />
              </div> */}

              <div className={styles.cardItem}>
                <h4>Mensaje en tarjeta dedicatoria</h4>
                <span>{order.dedicationCardMessage}</span>
              </div>
              {
                order.image &&
                <div className={styles.cardItem}>
                  <h4>Imagen de referencia</h4>
                  <div className={styles.image}>
                    <Image alt='' fill src={order.image as string} />
                  </div>
                </div>
              }

              <div className={styles.cardItem}>
                <h4>Información de pago</h4>

                <div className={styles.listItem}>
                  <span>Subtotal de articulos:</span>
                  <span>{formatCurrency(order.subTotal)}</span>
                </div>

                <div className={styles.listItem}>
                  <span>Envío:</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>

                {
                  order.type === 'manual' && <>
                    <div className={styles.listItem}>
                      <span>Anticipo:</span>
                      <span>{formatCurrency(order.anticipo)}</span>
                    </div>

                    <div className={styles.listItem}>
                      <span>Restante:</span>
                      <span>{formatCurrency(order.remaining)}</span>
                    </div>
                  </>
                }

                {
                  order.cart && order.cart.discount &&
                  <div className={styles.listItem} >
                    <span>Descuento: {order.cart.discount.name} (-{order.cart.discount.type === 'fixed' ? `$ ${order.cart.discount.value.toFixed(2)} MXN` : `${order.cart.discount.value}%`})</span>
                    <span>- $ {
                      order.cart.discount.type === 'percentage' ? (order.subTotal * (order.cart.discount.value / 100)).toFixed(2) : 0
                    } MXN</span>
                  </div>
                }
                <div className={styles.listItem}>
                  <span>Total:</span>
                  <span>$ {order.total.toFixed(2)} MXN</span>
                </div>
              </div>

              {
                order.status === 'Entregado' &&
                <>
                  <div className={styles.cardItem}>
                    <h4>Fecha entregado:</h4>
                    <span>{moment(order.deliveredDate).format("lll")}</span>
                  </div>
                  <div className={styles.cardItem}>
                    <h4>Notas de entrega:</h4>
                    <span>{order.deliveryNotes}</span>
                  </div>
                  <div className={styles.cardItem}>
                    <h4>Evidencia de entrega</h4>
                    <div className={styles.image}>
                      <Image alt='' fill src={order.deliveryEvidence} />
                    </div>
                  </div>
                  <div className={styles.cardItem}>
                    <h4>Autoriza redes sociales:</h4>
                    {
                      order.authorizesSocialMedia ?
                        <Chip text='Si autoriza' color='green' /> : <Chip text='No autoriza' />
                    }
                  </div>
                </>
              }
            </div>
          </div>

          <div className={styles.right}>
            <div className={`${styles.card} ${styles.products}`}>
              <div className={styles.cardHeader}>
                <h4>Productos</h4>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardItem}>
                  {
                    order.products.map(product => (
                      <>
                        {
                          product.product ? <div
                            key={product}
                            style={{ marginBottom: 20, whiteSpace: 'pre-line' }}
                          >
                            <b style={{ marginBottom: 10 }}>{product.product}</b>
                            <span>{product.specs}</span>
                          </div> : <CartItem
                            showAttributes
                            key={product.cartItemId}
                            {...product}
                          />
                        }
                      </>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {

  const number = params?.order

  let order

  let errorCode = null;

  let errorMessage = null;

  try {

    const token = getServerSideToken(req)

    const data = await makeRequest('get', `/api/online-store/orders/${number}`, {}, {
      headers: {
        "x-access-token": token,
        "x-location": "admin"
      }
    })
    order = data.order
  } catch (error: any) {
    errorCode = error.response?.status
    errorMessage = error.response?.data.message
  }

  if (errorCode) {
    console.log({ errorCode, errorMessage })
    return {
      props: {
        error: {
          error: errorCode,
          message: errorMessage
        }
      },
    };
  }

  return {
    props: {
      order
    }
  }
}

AccountOrderDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Pedidos">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};


export default AccountOrderDetailsPage;
