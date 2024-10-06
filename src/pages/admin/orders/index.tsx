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

interface Props {
  orders: OrderInterface[],
  page: number,
  limit: number,
  size: number,
  errorCode: number
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

const OrdersAdminPage = ({ page, limit, size, orders = [], errorCode }: Props) => {

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
      key: 'customer'
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
          errorCode ? 'No tienes acceso para ver esta información.' :
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
                  size={size}
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

  try {

    const token = getServerSideToken(nextReq)

    const data = await makeRequest('get', `/api/orders?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token,
      }
    })

    orders = data.orders;

  } catch (error: any) {

    // Set errorCode based on the type of error (you can customize based on your needs)
    if (error.response?.status === 401) {
      errorCode = 401; // Unauthorized
    } else if (error.response?.status === 500) {
      errorCode = 500; // Internal Server Error
    } else {
      errorCode = 400; // General Error
    }
  }

  // Handle redirection or returning error code
  if (errorCode) {
    return {
      props: {
        errorCode, // Pass the error code to the frontend to render an error page
      },
    };
  }

  return {
    props: {
      orders,
      page: Number(page),
      limit: Number(limit),
      size: Number(orders.length),
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