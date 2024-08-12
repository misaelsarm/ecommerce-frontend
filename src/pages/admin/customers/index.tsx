import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
//import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'
import debounce from 'lodash.debounce';
import Table from '@/components/admin/Table'
import { UserInterface } from '@/interfaces'
import PageHeader from '@/components/admin/PageHeader'
import moment from 'moment'

interface Props {
  customers: UserInterface[],
  page: number,
  limit: number,
  size: number
}

const CustomersAdminPage = ({ customers, page, limit, size }: Props) => {

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
        push(`/admin/customers?page=1&limit=20`);
      } else {
        push(`/admin/customers?search=${searchTerm}`);
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
          size={size}
          navigateTo='customers'
        />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;
  let users = []

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

    const { data } = await api.get(`/api/users?role=customer&page=${page}&limit=${limit}&search=${search}`, {
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
      customers: users,
      page: Number(page),
      limit: Number(limit),
      size: Number(users.length),
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