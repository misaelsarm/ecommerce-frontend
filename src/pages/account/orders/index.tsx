import AccountLayout from '@/components/online-store/AccountLayout';
import { Layout } from '@/components/online-store/Layout';
import { OrderInterface } from '@/interfaces';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { makeRequest } from '@/utils/makeRequest';
import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react'
import styles from '@/styles/online-store/account/Orders.module.scss'
import { formatCurrency } from '@/utils/formatCurrency';
import Link from 'next/link';
import moment from 'moment';
import Empty from '@/components/online-store/Empty';
import Chip from '@/components/common/Chip/Chip';
import { orderStatusColorMap } from '@/utils/mappings';

interface Props {
  orders: OrderInterface[],
  page: number,
  limit: number,
  error: {
    error: number,
    message: string
  }
  batchSize: number,
  totalRecords: number
}

const AccountOrdersPage = ({ orders = [] }: Props) => {
  return (
    <div className={styles.orders}>
      {
        orders.length === 0 ? <Empty

          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
          </svg>}
          title='Aún no hay pedidos'
        /> : orders.map(order => (
          <div className={styles.order} key={order.number}>
            <div className={styles.top}>
              <div className={styles.number}>
                <span>Tu pedido {order.number}</span>
              </div>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <h4>Fecha de entrega</h4>
                  <span>{moment(order.deliveryDate).format('ll')}</span>
                </div>
                <div className={styles.field}>
                  <h4>Total</h4>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className={styles.field}>
                  <h4>Enviar a</h4>
                  <span>{order.receiverName}</span>
                </div>
                <div className={styles.field}>
                  <h4>Estado</h4>
                  {/* @ts-ignore */}
                  <Chip text={order.status} color={orderStatusColorMap[order.status]} />
                </div>
              </div>
            </div>
            <div className={styles.bottom}>

              <Link href={`/account/orders/${order.number}`}>
                <span>Ver pedido</span>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  let orders = []

  let errorCode = null;

  let errorMessage = null;

  let data

  const url = `/api/me/orders`

  try {

    const token = getServerSideToken(req)

    data = await makeRequest('get', url, {}, {
      headers: {
        "x-access-token": token,
      }
    })

    orders = data.orders;

  } catch (error: any) {
    errorCode = error.response?.status
    errorMessage = error.response?.data.message

  }

  // Handle redirection or returning error code
  if (errorCode) {
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
      orders
    },
  };
}

AccountOrdersPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Pedidos">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};


export default AccountOrdersPage