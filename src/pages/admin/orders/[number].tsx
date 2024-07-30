import Layout from '@/components/admin/Layout'
import OrderDetails from '@/components/admin/orders/OrderDetails'
import { Order } from '@/interfaces'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import React, { ReactElement } from 'react'

interface Props {
  order: Order
}

const OrderDetailsPage = ({ order }: Props) => {
  return (
    <OrderDetails order={order} />
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
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
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