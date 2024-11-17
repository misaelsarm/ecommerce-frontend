import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/admin/Layout';
import Table from '@/components/admin/Table';
import PageHeader from '@/components/admin/PageHeader';
import { OrderInterface } from '@/interfaces';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { numberWithCommas } from '@/utils/numberWithCommas';
import Chip from '@/components/common/Chip';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { makeRequest } from '@/utils/makeRequest';
import moment from 'moment';

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

// Define a type for your possible statuses
type Status = 'Nuevo' | 'En camino' | 'Cancelado' | 'Entregado';

// Create a mapping of status to color
const statusColorMap: Record<Status, string> = {
  "Nuevo": 'blue',
  'En camino': 'yellow',
  'Cancelado': 'red',
  'Entregado': 'green',
};

const OrdersAdminPage = ({ page, limit, batchSize, totalRecords, orders = [], error }: Props) => {

  console.log({ orders })

  const { push, query } = useRouter()

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'orders', limit })

  const columns = [
    {
      title: 'Numero de pedido',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Nombre de cliente',
      dataIndex: 'customer',
      key: 'customer',
      render: (text: string, record: OrderInterface) => record.type === 'manual' || !record.user ? record.guestUser?.name

        : record.user?.name
    },
    {
      title: 'Fecha de compra',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => moment(text).format('lll')
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        //@ts-ignore
        const color = statusColorMap[text];
        return (
          <Chip color={color} text={text} />
        )
      }
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (_text: string, record: OrderInterface) => {
        return record.cart &&
          <div className='flex column'>
            {
              record.cart.items?.map(item => (
                <div key={item.cartItemId} className='flex'>
                  <span>-</span>
                  <span className='ml-10'>{item.name}</span>
                </div>
              ))
            }
          </div>
      },
    },
    {
      title: 'Ubicación',
      dataIndex: 'city',
      key: 'city',
      //render: (_text: string, record: Order) => `${record.shippingAddress?.city}, ${record.shippingAddress?.state}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (_text: string, record: OrderInterface) => `$ ${numberWithCommas(record.total?.toFixed(2))}`
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: OrderInterface) => <Link href={`/admin/orders/${record.number}`} className='btn btn-auto btn-black'>Ver pedido</Link>
    }
  ]

  return (
    <>
      <div className="page">
        {
          error ? error.message :
            <>
              <PageHeader
                title='Pedidos'
                actions={
                  [
                    {
                      name: "Action 1",
                      onClick: () => {
                        alert('Action 1')
                      }
                    },
                    {
                      name: "Action 2",
                      onClick: () => {
                        alert('Action 2')
                      }
                    },
                  ]
                }
                handleSearch={handleSearch}
                searchQuery={query.search}
                searchTerm={searchTerm}
                onClearSearch={() => {
                  push(`/admin/orders?page=1&limit=20`);
                  setSearchTerm('')
                }}
              />
              <div className="pageContent">
                <Table
                  page={page}
                  limit={limit}
                  columns={columns}
                  data={orders}
                  batchSize={batchSize}
                  totalRecords={totalRecords}
                  navigateTo='orders'
                />
              </div>
            </>
        }
      </div>
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

    data = await makeRequest('get', `/api/orders?page=${page}&limit=${limit}&search=${search}`, {}, {
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