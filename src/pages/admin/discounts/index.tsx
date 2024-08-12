import { api } from '@/api_config/api'
import AddDiscount from '@/components/admin/discounts/AddDiscount'
import Layout from '@/components/admin/Layout'
import PageHeader from '@/components/admin/PageHeader'
import Table from '@/components/admin/Table'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { DiscountInterface } from '@/interfaces'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'

interface Props {
  discounts: DiscountInterface[],
  page: number,
  limit: number,
  size: number
}

const DiscountsAdminPage = ({ discounts = [], page, limit, size }: Props) => {

  const [visible, setVisible] = useState(false)

  const { push, query, replace } = useRouter()

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'discounts', limit })


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
      render: (_text: string, record: DiscountInterface) => record.type.label
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: (_text: string, record: DiscountInterface) => record.type.value === 'fixed' ? `$ ${record.value.toFixed(2)} MXN` : `${record.value}%`,
    },
    {
      title: 'Fecha de expiración',
      dataIndex: 'expiry',
      key: 'expiry',
      //render: (text: string) => moment(text).format('ll')
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: DiscountInterface) => record.active ? 'Activo' : 'No activo'
    },
    {
      title: 'Detalles',
      render: (_text: string, record: DiscountInterface) => <Link className="btn btn-black btn-auto" href={`/admin/discounts/${record.id}`}>Ver</Link>
    }
  ]

  return (
    <>
      <div className="page">
        <PageHeader
          title='Descuentos'
          actions={
            [
              {
                name: "Nuevo descuento",
                onClick: () => {
                  setVisible(true)
                }
              }
            ]
          }
          handleSearch={handleSearch}
          searchQuery={query.search}
          searchTerm={searchTerm}
          onClearSearch={() => {
            push(`/admin/discounts?page=1&limit=20`);
            setSearchTerm('')
          }}
        />
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

  let discounts = []

  try {

    // Extract the token from cookies
    const token = nextReq.headers.cookie
      ?.split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];


    if (!token) {
      // No token found, redirect to login
      return {
        redirect: {
          destination: '/admin/login', // Redirect to your login page
          permanent: false,
        },
      };
    }

    const { data } = await api.get(`/api/discounts?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        "x-access-token": token
        // "x-location": "admin"
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