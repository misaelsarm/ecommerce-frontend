import Layout from '@/components/admin/Layout'
import { Card, CardItem, CartItem, Chip, Modal, Page } from '@/components/common'
import { OrderInterface } from '@/interfaces'
import { formatCurrency } from '@/utils/formatCurrency'
import { orderStatusColorMap } from '@/utils/mappings'
import { createServerSideFetcher } from '@/utils/serverSideFetcher'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import React, { ReactElement, useState } from 'react'

interface Props {
  order: OrderInterface,
  error: {
    message: string,
    error: number
  }
}

const OrderDetailsPage = ({ order, error }: Props) => {

  const [editing, setEditing] = useState(false)
  
  const color = orderStatusColorMap[order.status];

  return (
    <>
      <Page
        maxwidth='700px'
        fullWidth={false}
        title={`Pedido #${order.number}`}
        backAction
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
            <CardItem title='Información de cliente'
              content={<>
                <span>{order.name}</span>
                <span>{order.email}</span>
                <span>{order.phone}</span>
              </>}
            />
            {/* <CardItem>
              <h4>Tipo de pedido</h4>
              <span>{order.type}</span>
            </CardItem> */}
            <CardItem
              title='Fecha de compra'
              content={<span>{moment(order.createdAt).format('lll')}</span>}
            />
            <CardItem
              title='Productos'
              content={
                order.products.map(product => (
                  <CartItem
                    showAttributes
                    key={product.cartItemId}
                    {...product}
                  />
                ))
              }
            />
            <CardItem
              title='Información de pago'
              content={<>
                <div className="listItem">
                  <span>Subtotal de articulos:</span>
                  <span>{formatCurrency(order.subTotal)}</span>
                </div>

                <div className="listItem">
                  <span>Envío:</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                {
                  order.type === 'manual' && <>
                    <div className="listItem">
                      <span>Anticipo:</span>
                      <span>{formatCurrency(order.anticipo)}</span>
                    </div>

                    <div className="listItem">
                      <span>Restante:</span>
                      <span>{formatCurrency(order.remaining)}</span>
                    </div>
                  </>
                }
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
              </>}
            />
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
    endpoint: '/api/admin/orders/:number',
    dataKey: 'order',
    propKey: 'order',
    paramKey: 'number',
  })
}

OrderDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Pedidos | ${page.props.order.number}`}>
      {page}
    </Layout>
  );
};

export default OrderDetailsPage