import Layout from '@/components/admin/Layout'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import { UserInterface } from '@/interfaces'
import moment from 'moment'
import { getServerSideToken } from '@/utils/getServerSideToken'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { makeRequest } from '@/utils/makeRequest'
import { Chip, Page, Table } from '@/components/common'
import { usePermissions } from '@/hooks/usePermissions'

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

const CustomersAdminPage = ({ customers, page, limit, batchSize, totalRecords, error }: Props) => {

  const [visible, setVisible] = useState(false)

  const { canCreate } = usePermissions();

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
    }
  ]

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'customers', limit })

  const { push, query, replace } = useRouter()

  return (
    error ? <Page>{error.message}</Page> :
      <Page
        title='Clientes'
        primaryAction={{
          name: "Nuevo cliente",
          onClick: () => {
            setVisible(true)
          },
          visible: canCreate
        }}
        search={{
          handleSearch,
          searchTerm,
          onClearSearch: () => {
            push(`/admin/customers?page=1&limit=20`);
            setSearchTerm('')
          }
        }}
      >
        <Table
          columns={columns}
          data={customers}
          page={page}
          limit={limit}
          batchSize={batchSize}
          totalRecords={totalRecords}
          navigateTo='admin/customers'
          paramKey='_id'
        />
      </Page>
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

    data = await makeRequest('get', `/api/admin/users?role=customer&page=${page}&limit=${limit}&search=${search}`, {}, {
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