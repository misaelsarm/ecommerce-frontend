import Layout from '@/components/admin/Layout'
import CartItem from '@/components/common/CartItem/CartItem'
import Chip from '@/components/common/Chip/Chip'
import Modal from '@/components/common/Modal/Modal'
import { AuthContext } from '@/context/auth/AuthContext'
import { OrderInterface } from '@/interfaces'
import { getServerSideToken } from '@/utils/getServerSideToken'
import { hasPermission } from '@/utils/hasPermission'
import { makeRequest } from '@/utils/makeRequest'
import axios from 'axios'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useContext, useState } from 'react'

interface Props {
  order: OrderInterface
}

// Define a type for your possible statuses
type Status = 'Nuevo' | 'En camino' | 'Cancelado' | 'Entregado';

// Create a mapping of status to color
const statusColorMap: Record<Status, string> = {
  "Nuevo": 'blue',
  'En camino': 'yellow',
  'Cancelado': 'red',
  'Entregado': 'green',
};

const OrderDetailsPage = ({ order }: Props) => {

  console.log({ order })

  const { back, replace, pathname } = useRouter()

  const { user } = useContext(AuthContext)

  const [editing, setEditing] = useState(false)

  const canCreateEdit = user.role === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

  //@ts-ignore
  const color = statusColorMap[order.status];

  return (
    <>
      <div className='detailPage'>
        <div className="page-actions">
          <button
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              back()
            }}
            className='back'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg></button>
          {
            !editing && canCreateEdit && <button className='btn btn-black' onClick={() => { setEditing(true) }}>Editar</button>
          }
        </div>
        <div className="card">
          <>
            <div className="cardItem">
              <h4>Numero de pedido</h4>
              <span>{order.number}</span>
            </div>
            <div className="cardItem">
              <h4>Estado</h4>
              <Chip color={color} text={order.status} />
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
              {
                order.user ? <>
                  <span>{order.user.name}</span>
                  <span>{order.user.email}</span>
                  <span>{order.user.phone}</span>
                </> : <>
                  <span>{order.guestUser.name}</span>
                  <span>{order.guestUser.email}</span>
                  <span>{order.guestUser.phone}</span>
                </>
              }
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
              <span>{moment(order.createdAt).format('lll')}</span>
            </div>
            <div className="cardItem">
              <h4>Productos</h4>
              {
                order.products.map(product => (
                  <CartItem
                    showAttributes
                    key={product.cartItemId}
                    {...product}
                  />
                ))
              }
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
                  <span>Descuento: {order.cart.discount.name} (-{order.cart.discount.type === 'fixed' ? `$ ${order.cart.discount.value.toFixed(2)} MXN` : `${order.cart.discount.value}%`})</span>
                  <span>- $ {
                    order.cart.discount.type === 'percentage' ? (order.subTotal * (order.cart.discount.value / 100)).toFixed(2) : 0
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
      <Modal
        visible={editing}
        //loadingState={saving}
        //onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar pedido'
        onClose={() => {
          setEditing(false)
        }}
      >
        <div></div>
        {/*  {renderForm()} */}
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req: nextReq }) => {

  const number = params?.number

  let order

  try {

    const token = getServerSideToken(nextReq)

    const data = await makeRequest('get', `/api/orders/${number}`, {}, {
      headers: {
        "x-access-token": token,
        "x-location": "admin"
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