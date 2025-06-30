import AccountLayout from '@/components/online-store/AccountLayout';
import { Layout } from '@/components/online-store/Layout';
import React, { ReactElement, useState } from 'react'
import styles from '@/styles/online-store/account/Discounts.module.scss'
import { GetServerSideProps } from 'next';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { makeRequest } from '@/utils/makeRequest';
import { getServerSideUserId } from '@/utils/getServerSideUserId';
import { DiscountInterface } from '@/interfaces';
import moment from 'moment';
import Empty from '@/components/Empty';

interface Props {
  discounts: DiscountInterface[]
}

const AccountDiscountsPage = ({ discounts }: Props) => {

  const [show, setShow] = useState(false)

  return (
    <div className={styles.discounts} >
      {
        discounts.length === 0 ? <Empty icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        } title='Aun no tienes descuentos' /> : discounts.map(item => (
          <div key={item._id} className={styles.item}>
            <div className={styles.info}>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
              </svg>

              <div className={styles.name}>
                <h2>$250.00 pesos de descuento</h2>
                <span>Vigencia: {moment(item.endDate).format('ll')}</span>
              </div>

            </div>
            <div className={styles.actions}>
              {show &&
                <span> {item.name}</span>
              }
              <button onClick={() => setShow(!show)} className='btn btn-primary'>{show ? 'Ocultar' : 'Mostrar'} código</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  let discounts = []

  let errorCode = null;

  let errorMessage = null;

  let data

  try {

    const token = getServerSideToken(req)

    const user = getServerSideUserId(req)

    data = await makeRequest('get', `/api/discounts?user=${user}&active=true`, {}, {
      headers: {
        "x-access-token": token
        // "x-location": "admin"
      }
    })

    discounts = data.discounts

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
      discounts,
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
    },
  };
}

AccountDiscountsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Pedidos">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};

export default AccountDiscountsPage