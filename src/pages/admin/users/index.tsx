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

interface Props {
  users: UserInterface[],
  page: number,
  limit: number,
  size: number
}

const UsersAdminPage = ({ users, page, limit, size }: Props) => {

  const columns = [
    {
      title: 'Nombre de cliente',
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
  ]

  const { push, query } = useRouter()

  const [searchTerm, setSearchTerm] = useState(query.search)

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        push(`/admin/users?page=1&limit=20`);
      } else {
        push(`/admin/users?search=${searchTerm}`);
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
    <div className="page">
      <PageHeader
        title='Clientes'
        actions={
          [
            {
              name: "Nuevo cliente",
              onClick: () => {
                //setVisible(true)
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
    <Layout title="Clientes">
      {page}
    </Layout>
  );
};

export default UsersAdminPage