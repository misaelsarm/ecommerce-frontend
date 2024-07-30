import { api } from '@/api_config/api'
import AddDiscount from '@/components/admin/discounts/AddDiscount'
import Layout from '@/components/admin/Layout'
import Table from '@/components/admin/Table'
import { Discount } from '@/interfaces'
import debounce from 'lodash.debounce'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'

interface Props {
  discounts: Discount[],
  page: number,
  limit: number,
  size: number
}

const DiscountsAdminPage = ({ discounts, page, limit, size }: Props) => {

  const [visible, setVisible] = useState(false)

  const { push, query, replace } = useRouter()

  const [searchTerm, setSearchTerm] = useState(query.search)

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (_text: string, record: Discount) => record.type.label
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: (_text: string, record: Discount) => record.type.value === 'fixed' ? `$ ${record.value.toFixed(2)} MXN` : `${record.value}%`,
    },
    {
      title: 'Fecha de expiración',
      dataIndex: 'expiry',
      key: 'expiry',
      render: (text: string) => moment(text).format('ll')
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: Discount) => record.active ? 'Activo' : 'No activo'
    },
    {
      title: 'Detalles',
      render: (_text: string, record: Discount) => <Link className="btn btn-black btn-auto" href={`/admin/discounts/${record.id}`}>Ver</Link>
    }
  ]

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        push(`/admin/discounts?page=1&limit=20`);
      } else {
        push(`/admin/discounts?search=${searchTerm}`);
      }
    }, 500),
    [limit]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    debouncedSearch(searchTerm);
  };

  return (
    <>
      <div className="page">
        <div className="pageHeader">
          <h2>Descuentos</h2>
          <button onClick={() => {
            setVisible(true)
          }} className="btn btn-pink">Nuevo descuento</button>
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
                push(`/admin/discounts?page=1&limit=20`);
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
            columns={columns}
            data={discounts}
            page={page}
            limit={limit}
            size={size}
            navigateTo='discounts'
          />
        </div>
      </div>
      <AddDiscount
        visible={visible}
        setVisible={setVisible}
        onOk={() => {
          replace("/admin/discounts?page=1&limit=20")
          setVisible(false)
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  const req = nextReq as any

  let discounts = []

  try {
    const { data } = await api.get(`/api/discounts?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    discounts = data.discounts

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
      discounts,
      page: Number(page),
      limit: Number(limit),
      size: Number(discounts.length),
    },
  };
}

DiscountsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Descuentos">
      {page}
    </Layout>
  );
};

export default DiscountsAdminPage