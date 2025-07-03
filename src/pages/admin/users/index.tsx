import Layout from '@/components/admin/Layout'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import Table from '@/components/common/Table/Table'
import { UserInterface } from '@/interfaces'
import moment from 'moment'
import { getServerSideToken } from '@/utils/getServerSideToken'
import Chip from '@/components/common/Chip/Chip'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import AddUser from '@/components/admin/users/AddUser'
import { makeRequest } from '@/utils/makeRequest'
import { userRolesMap } from '@/utils/mappings';
import Page from '@/components/common/Page/Page';

interface Props {
  users: UserInterface[],
  page: number,
  limit: number,
  error: {
    error: number,
    message: string
  }
  batchSize: number,
  totalRecords: number
}

const UsersAdminPage = ({ users, page, limit, batchSize, totalRecords, error }: Props) => {

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
      title: 'Tipo de usuario',
      dataIndex: 'role',
      key: 'role',
      render: (text: string, record: UserInterface) => userRolesMap[record.role]
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
    // {
    //   title: 'Detalles',
    //   dataIndex: 'detalles',
    //   key: 'detalles',
    //   render: (_text: string, record: UserInterface) => (
    //     <Link href={`/admin/users/${record._id}`} className='btn btn-black btn-auto'>Ver</Link>
    //   )
    // },
  ]

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'users', limit })

  const { push, query, replace } = useRouter()

  const [visible, setVisible] = useState(false)

  return (
    <>
      {
        error ? <Page>{error.message}</Page> : <>
          <Page
            title='Usuarios'
            primaryAction={{
              name: "Nuevo usuario",
              onClick: () => {
                setVisible(true)
              }
            }}
            search={{
              handleSearch: handleSearch,
              searchTerm: searchTerm,
              onClearSearch: () => {
                push(`/admin/users?page=1&limit=20`);
                setSearchTerm('')
              }
            }}
          >
            <Table
              columns={columns}
              data={users}
              page={page}
              limit={limit}
              batchSize={batchSize}
              totalRecords={totalRecords}
              navigateTo='admin/users'
              paramKey='_id'
            />
          </Page>
          <AddUser
            visible={visible}
            setVisible={setVisible}
            onOk={() => {
              setVisible(false)
              replace('/admin/users?page=1&limit=20')
            }}
          />
        </>
      }
    </>
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

    data = await makeRequest('get', `/api/admin/users?role=admin,user&page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        //@ts-ignore
        "x-access-token": token
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
      users: users,
      page: Number(page),
      limit: Number(limit),
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
    },
  };
}

UsersAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Usuarios">
      {page}
    </Layout>
  );
};

export default UsersAdminPage