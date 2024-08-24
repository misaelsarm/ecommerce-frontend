import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'
import debounce from 'lodash.debounce';
import Table from '@/components/admin/Table'
import { UserInterface } from '@/interfaces'
import PageHeader from '@/components/admin/PageHeader'
import moment from 'moment'
import { getServerSideToken } from '@/utils/getServerSideToken'
import Chip from '@/components/common/Chip'
import Link from 'next/link'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import AddUser from '@/components/admin/users/AddUser'

interface Props {
  users: UserInterface[],
  page: number,
  limit: number,
  size: number
}

const UsersAdminPage = ({ users, page, limit, size }: Props) => {

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
      render: (text: string, record: UserInterface) => record.role.label
    },
    {
      title: 'Ultimo ingreso',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_text: string, record: UserInterface) => record.lastLogin ? moment(record.lastLogin).format('lll') : null
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (_text: string, record: UserInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='activo' color='green' /> : <Chip text='no activo' />
        }
        {
          record.verified ? <Chip text='verificado' color='green' /> : <Chip text='no verificado' />
        }
      </div>
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: UserInterface) => (
        <Link href={`/admin/users/${record._id}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
  ]

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'users', limit })

  const { push, query, replace } = useRouter()

  const [visible, setVisible] = useState(false)

  return (
    <>
      <div className="page">
        <PageHeader
          title='Usuarios'
          actions={
            [
              {
                name: "Nuevo usuario",
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
            push(`/admin/users?page=1&limit=20`);
            setSearchTerm('')
          }}
        />
        <div className="pageContent">
          <Table
            columns={columns}
            data={users}
            page={page}
            limit={limit}
            size={size}
            navigateTo='users'
          />
        </div>
      </div>
      <AddUser
        visible={visible}
        setVisible={setVisible}
        onOk={() => {
          setVisible(false)
          replace('/admin/users?page=1&limit=20')
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;
  let users = []

  try {
    const token = getServerSideToken(nextReq)

    const { data } = await api.get(`/api/users?role=admin,user&page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        //@ts-ignore
        "x-access-token": token,
        "x-location": "admin"
      }
    })
    users = data.users

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
      users: users,
      page: Number(page),
      limit: Number(limit),
      size: Number(users.length),
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