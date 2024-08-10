import Layout from '@/components/admin/Layout'
import Modal from '@/components/common/Modal'
import { OrderInterface } from '@/interfaces'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'

interface Props {
  order: OrderInterface
}

const OrderDetailsPage = ({ order }: Props) => {

  const { back, replace } = useRouter()

  const [editing, setEditing] = useState(false)

  return (
    <>
      <div className='detailPage'>
        <div className="page-actions">
          <button
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              // back()
            }}
            className='back'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg></button>
          {
            !editing && <button className='btn btn-black' onClick={() => { setEditing(true) }}>Editar</button>
          }
        </div>
        <div className="card">
          <>
            <div className="cardItem">
              <h4>Numero de pedido</h4>
              <span>{order.number}</span>
            </div>
            {/* <div className="cardItem">
              <h4>Numero de guía</h4>
              <span>{order.guideNumber}</span>
            </div>
            <div className="cardItem">
              <h4>Paquetería</h4>
              <span>{order.shippingName}</span>
            </div> */}
            <div className="cardItem">
              <h4>Estado</h4>
              <span>{order.status}</span>
            </div>
            <div className="cardItem">
              <h4>Dirección de entrega</h4>
              <span>{order.shippingAddress?.street}, {order.shippingAddress.colonia}, {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</span>
            </div>
            <div className="cardItem">
              <h4>Instrucciones de entrega</h4>
              {
                <span>{order.shippingAddress.deliveryInstructions} {order.shippingAddress.apartment}</span>
              }
            </div>
            <div className="cardItem">
              <h4>Información de cliente</h4>
              {/* <span>{order.customer}</span>
              <span>{order.email}</span>
              <span>{order.phone}</span> */}
            </div>
            {/* {
              order.invoiceRequired &&
              <div className="cardItem">
                <h4>Información de facturación</h4>
                <span>RFC: {order.tax.rfc}</span>
                <span>Razón social: {order.tax.razonSocial}</span>
                <span>Uso CFDI: {order.tax.usoCfdi.label}</span>
                <a target='_blank' rel='noreferrer' href={order.tax.fileUrl} >Ver Constancia de situacion fiscal</a>
              </div>
            } */}
            <div className="cardItem">
              <h4>Tipo de pedido</h4>
              {/* <span>{order.type}</span> */}
            </div>
            <div className="cardItem">
              <h4>Fecha de compra</h4>
              {/* <span>{moment(order.createdAt).format('lll')}</span> */}
            </div>
            <div className="cardItem">
              <h4>Productos</h4>
              {/* {
                order.cart && order.cart.items.map(product => (
                  <CartItem
                    showAttributes
                    key={product.cartItemId}
                    {...product}
                  />
                ))
              } */}
            </div>
            <div className="cardItem">
              <h4>Información de pago</h4>
              <div className="listItem">
                <span>Subtotal de articulos:</span>
                <span> $ {order.subTotal.toFixed(2)} MXN</span>
              </div>

              <div className="listItem">
                <span>Envío:</span>
                <span>$ {order.shippingFee.toFixed(2)} MXN</span>
              </div>

              {
                order.cart && order.cart.discount &&
                <div className="listItem" >
                  <span>Descuento: {order.cart.discount.name} (-{order.cart.discount.type.value === 'fixed' ? `$ ${order.cart.discount.value.toFixed(2)} MXN` : `${order.cart.discount.value}%`})</span>
                  <span>- $ {
                    order.cart.discount.type.value === 'percentage' ? (order.subTotal * (order.cart.discount.value / 100)).toFixed(2) : 0
                  } MXN</span>
                </div>
              }
              <div className="listItem">
                <span>Total:</span>
                <span>$ {order.total.toFixed(2)} MXN</span>
              </div>
            </div>
          </>
        </div>
      </div >
      {/* <Modal
        visible={editing}
        loadingState={saving}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar pedido'
        onClose={() => {
          setEditing(false)
        }}
      >
        {renderForm()}
      </Modal> */}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req: nextReq }) => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const number = params?.number

  const req = nextReq as any

  let order

  try {
    const { data } = await axios.get(`${apiUrl}/api/orders/${number}`, {
      headers: {
        //@ts-ignore
        // "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        // "x-location": "admin"
      }
    })
    order = data.order
  } catch (error) {
    console.log({ error })
  }

  return {
    props: {
      order
    }
  }
}

OrderDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Orden">
      {page}
    </Layout>
  );
};

export default OrderDetailsPage