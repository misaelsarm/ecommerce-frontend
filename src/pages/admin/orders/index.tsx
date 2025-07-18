import { GetServerSideProps } from 'next'
import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/admin/Layout';
import { OrderInterface } from '@/interfaces';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { numberWithCommas } from '@/utils/numberWithCommas';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { makeRequest } from '@/utils/makeRequest';
import moment from 'moment';
import { orderStatusColorMap } from '@/utils/mappings';
import { Chip, Page, Table } from '@/components/common';
import { usePermissions } from '@/hooks/usePermissions';

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

const OrdersAdminPage = ({ page, limit, batchSize, totalRecords, orders, error }: Props) => {

  const { push, query } = useRouter()

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'orders', limit })

  const { canCreate } = usePermissions()

  const columns = [
    {
      title: 'Numero de pedido',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Nombre de cliente',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (_text: string, record: OrderInterface) => {
        return (
          <div className='flex column'>
            {
              record.products?.map(item => (
                <div key={item.cartItemId || item.product} className='flex'>
                  <span>-</span>
                  <span className='ml-10'>{item.name || item.product}</span>
                </div>
              ))
            }
          </div>
        )
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        //@ts-ignore
        const color = orderStatusColorMap[text];
        return (
          <Chip color={color} text={text} />
        )
      }
    },
    {
      title: 'Fecha de compra',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => moment(text).format('lll')
    },
    {
      title: 'Ubicación',
      dataIndex: 'shippingAddress.city',
      key: 'shippingAddress.city',
      render: (_text: string, record: OrderInterface) => `${record.shippingAddress?.city}, ${record.shippingAddress?.state}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (_text: string, record: OrderInterface) => `$ ${numberWithCommas(record.total?.toFixed(2))}`
    }
  ]

  return (
    <>
      <Page
        title='Pedidos'
        primaryAction={{
          name: "Nuevo pedido",
          onClick: () => console.log('nuevo pedido'),
          visible: canCreate
        }}
        search={{
          searchTerm: searchTerm as string,
          handleSearch,
          onClearSearch: () => {
            push(`/admin/orders?page=1&limit=20`);
            setSearchTerm('')
          }
        }}
      >
        <Table
          page={page}
          limit={limit}
          columns={columns}
          data={orders}
          batchSize={batchSize}
          totalRecords={totalRecords}
          navigateTo='admin/orders'
          paramKey='number'
        />
      </Page>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let orders = []

  let errorCode = null;

  let errorMessage = null;

  let data

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/admin/orders?page=${page}&limit=${limit}&search=${search}`, {}, {
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
      orders,
      page: Number(page),
      limit: Number(limit),
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
    },
  };
}

OrdersAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Pedidos">
      {page}
    </Layout>
  );
};

export default OrdersAdminPage