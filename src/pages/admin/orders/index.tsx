import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React, { ReactElement, useCallback, useState } from 'react'
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router'
//import Cookies from 'js-cookie'
import Layout from '@/components/admin/Layout';
import Table from '@/components/admin/Table';
import PageHeader from '@/components/admin/PageHeader';
import { OrderInterface } from '@/interfaces';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { api } from '@/api_config/api';
import { numberWithCommas } from '@/utils/numberWithCommas';
import Chip from '@/components/common/Chip';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { makeRequest } from '@/utils/makeRequest';

interface Props {
  orders: OrderInterface[],
  page: number,
  limit: number,
  size: number
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


const OrdersAdminPage = ({ page, limit, size, orders = [] }: Props) => {

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
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let orders = []

  try {

    const token = getServerSideToken(nextReq)

    const data = await makeRequest('get', `/api/orders?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token,
      }
    })

    orders = data.orders;

  } catch (error: any) {

    console.error('Error fetching orders:', error.message || error);

    if (error.response && error.response.status === 401) {
      // Unauthorized error, token might be invalid or expired
      return {
        redirect: {
          destination: '/admin/login', // Redirect to your login page
          permanent: false,
        },
      };
    }

    // Handle other potential errors
    return {
      redirect: {
        destination: '/error', // Redirect to an error page or handle appropriately
        permanent: false,
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