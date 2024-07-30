import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import Table from '@/components/admin/Table'
import { Order } from '@/interfaces'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React, { ReactElement, useCallback, useState } from 'react'
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

interface Props {
  orders: Order[],
  page: number,
  limit: number,
  size: number
}

const OrdersAdminPage = ({ orders, page, limit, size }: Props) => {

  const { push, query } = useRouter()

  const [searchTerm, setSearchTerm] = useState(query.search)

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        push(`/admin/orders?page=1&limit=20`);
      } else {
        push(`/admin/orders?search=${searchTerm}`);
      }
    }, 500),
    [limit]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    debouncedSearch(searchTerm);
  };

  const columns = [
    {
      title: 'Numero de pedido',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (_text: string, record: Order) => {
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
      render: (_text: string, record: Order) => `${record.shippingAddress?.city}, ${record.shippingAddress?.state}`,
    },
    {
      title: 'Nombre de cliente',
      dataIndex: 'customer',
      key: 'customer'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (_text: string, record: Order) => `$ ${record.total.toFixed(2)} MXN`
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: Order) => <Link href={`/admin/orders/${record.number}`} className='btn btn-auto btn-black'>Ver</Link>
    }
  ]

  return (
    <>
      <div className="page">

        <div className="pageHeader">
          <h2>Pedidos</h2>
          <button onClick={async () => {
            try {

              // Send the data to your Express backend using Axios
              const response = await api.post('/api/orders/export', {}, { responseType: 'arraybuffer', headers: {
                "x-location": "admin",
                "x-access-token": Cookies.get('token')
              } });

              // Create a Blob from the binary data
              const blob = new Blob([response.data], { type: 'application/octet-stream' });

              // Create a download link for the Blob and trigger the download
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'reporte-de-compras.xlsx';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error(error);
            }
          }} className='btn btn-black'>EXPORTAR</button>
        </div>

        <div className="pageHeader">
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Buscar pedidos...' className='input' type="text" />
        </div>
        {
          query.search &&
          <div className="pageHeader">
            <div
              onClick={() => {
                push(`/admin/orders?page=1&limit=20`);
                setSearchTerm('')
              }}
              className='clear-search'>
              <span>Mostrando resultados para: <b>{query.search}</b></span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        }
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

  const req = nextReq as any

  let orders = []

  try {
    const { data } = await api.get(`/api/orders?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    orders = data.orders

  } catch (error) {
    console.log({ error })
    return {
      redirect: {
        destination: '/',
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