import Layout from '@/components/admin/Layout'
import Card from '@/components/common/Card/Card'
import CardItem from '@/components/common/CardItem/CardItem'
import CartItem from '@/components/common/CartItem/CartItem'
import Chip from '@/components/common/Chip/Chip'
import Modal from '@/components/common/Modal/Modal'
import Page from '@/components/common/Page/Page'
import { AuthContext } from '@/context/auth/AuthContext'
import { OrderInterface } from '@/interfaces'
import { getServerSideToken } from '@/utils/getServerSideToken'
import { hasPermission } from '@/utils/hasPermission'
import { makeRequest } from '@/utils/makeRequest'
import { orderStatusColorMap } from '@/utils/mappings'
import { createServerSideFetcher } from '@/utils/serverSideFetcher'
import axios from 'axios'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useContext, useState } from 'react'

interface Props {
  order: OrderInterface,
  error: {
    message: string,
    error: number
  }
}

const OrderDetailsPage = ({ order, error }: Props) => {

  if (error) {
    return <Page>{error.message}</Page>
  }

  const { back, replace, pathname } = useRouter()

  const { user } = useContext(AuthContext)

  const [editing, setEditing] = useState(false)

  const canCreateEdit = user.role === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

  //@ts-ignore
  const color = orderStatusColorMap[order.status];

  return (
    <>
      <Page
        maxwidth='700px'
        fullWidth={false}
        title={`Pedido #${order.number}`}
        backAction={{
          url: '/admin/orders',
        }}
        primaryAction={{
          name: 'Editar',
          onClick: () => {
            setEditing(true)
          },
          //disabled: !canCreateEdit,
        }}
      >
        <Card>
          <>
            <CardItem
              title='Número de pedido'
              content={<span>{order.number}</span>}
            />
            <CardItem
              title='Estado'
              content={<Chip color={color} text={order.status} />}
            />
            <CardItem
              title='Dirección de entrega'
              content={<span>{order.shippingAddress?.street}, {order.shippingAddress.colonia}, {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</span>}
            />
            <CardItem
              title='Instrucciones de entrega'
              content={<span>{order.shippingAddress?.deliveryInstructions}</span>}
            />
            <CardItem
              title='Tipo de edificio'
              content={<span>{order.shippingAddress?.apartment}</span>}
            />




            <CardItem>
              <h4>Información de cliente / quien envía</h4>
              <span>{order.name}</span>
              <span>{order.email}</span>
              <span>{order.phone}</span>
            </CardItem>
            {/* {
              order.invoiceRequired &&
              <CardItem>
                <h4>Información de facturación</h4>
                <span>RFC: {order.tax.rfc}</span>
                <span>Razón social: {order.tax.razonSocial}</span>
                <span>Uso CFDI: {order.tax.usoCfdi.label}</span>
                <a target='_blank' rel='noreferrer' href={order.tax.fileUrl} >Ver Constancia de situacion fiscal</a>
              </CardItem>
            } */}
            <CardItem>
              <h4>Tipo de pedido</h4>
              {/* <span>{order.type}</span> */}
            </CardItem>
            <CardItem>
              <h4>Fecha de compra</h4>
              <span>{moment(order.createdAt).format('lll')}</span>
            </CardItem>
            <CardItem>
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
            </CardItem>
            <CardItem>
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
            </CardItem>
          </>
        </Card>
      </Page>
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

export const getServerSideProps: GetServerSideProps = async (context) => {

  return createServerSideFetcher(context, {
    endpoint: '/api/orders/:number',
    dataKey: 'order',
    propKey: 'order',
    paramKey: 'number',
  })
}

OrderDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Orden">
      {page}
    </Layout>
  );
};

export default OrderDetailsPage