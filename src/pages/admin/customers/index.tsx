import Layout from '@/components/admin/Layout'
//import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'
import debounce from 'lodash.debounce';
import Table from '@/components/common/Table/Table'
import { UserInterface } from '@/interfaces'
import PageHeader from '@/components/common/PageHeader/PageHeader'
import moment from 'moment'
import { getServerSideToken } from '@/utils/getServerSideToken'
import Link from 'next/link'
import Chip from '@/components/common/Chip/Chip'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { makeRequest } from '@/utils/makeRequest'

interface Props {
  customers: UserInterface[],
  page: number,
  limit: number,
  error: {
    error: number,
    message: string
  }
  batchSize: number,
  totalRecords: number
}

const CustomersAdminPage = ({ customers, page, limit, batchSize, totalRecords }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [deletedUser, setDeletedUser] = useState({} as UserInterface)

  const [visible, setVisible] = useState(false)

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Miembro desde',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_text: string, record: UserInterface) => moment(record.createdAt).format('lll')
    },
    {
      title: 'Ultimo ingreso',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_text: string, record: UserInterface) => record.lastLogin ? moment(record.lastLogin).format('lll') : null
    },
    {
      title: 'Estado',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: UserInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
        }
        {
          record.verified ? <Chip text='Verificado' color='green' /> : <Chip text='No verificado' />
        }
      </div>
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: UserInterface) => (
        <Link href={`/admin/customers/${record._id}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
  ]

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'customers', limit })

  const { push, query, replace } = useRouter()

  return (
    <div className="page">
      <PageHeader
        title='Clientes'
        actions={
          [
            {
              name: "Nuevo cliente",
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
          push(`/admin/customers?page=1&limit=20`);
          setSearchTerm('')
        }}
      />
      <div className="pageContent">
        <Table
          columns={columns}
          data={customers}
          page={page}
          limit={limit}
          batchSize={batchSize}
          totalRecords={totalRecords}
          navigateTo='customers'
        />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let users = []

  let errorCode = null;

  let errorMessage = null;

  let data

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/users?role=customer&page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        //@ts-ignore
        "x-access-token": token,
        "x-location": "admin"
      }
    })
    users = data.users

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
      customers: users,
      page: Number(page),
      limit: Number(limit),
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
    },
  };
}

CustomersAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Clientes">
      {page}
    </Layout>
  );
};

export default CustomersAdminPage