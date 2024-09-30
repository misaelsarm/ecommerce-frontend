import { api } from '@/api_config/api'
import AddDiscount from '@/components/admin/discounts/AddDiscount'
import Layout from '@/components/admin/Layout'
import PageHeader from '@/components/admin/PageHeader'
import Table from '@/components/admin/Table'
import Chip from '@/components/common/Chip'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { DiscountInterface } from '@/interfaces'
import { getServerSideToken } from '@/utils/getServerSideToken'
import { makeRequest } from '@/utils/makeRequest'
import moment from 'moment'
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
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text: string) => moment(text).format('ll')
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (_text: string, record: DiscountInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='activo' color='green' /> : <Chip text='no activo' />
        }
      </div>
    },
    {
      title: 'Detalles',
      render: (_text: string, record: DiscountInterface) => <Link className="btn btn-black btn-auto" href={`/admin/discounts/${record._id}`}>Ver</Link>
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

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query, resolvedUrl }) => {

  const { page, limit, search = '' } = query;

  let discounts = []

  try {

    const token = getServerSideToken(nextReq)

    const data = await makeRequest('get', `/api/discounts?page=${page}&limit=${limit}&search=${search}`, {}, {
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