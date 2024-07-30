import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import { User } from '@/interfaces'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'
import debounce from 'lodash.debounce';
import Table from '@/components/admin/Table'

interface Props {
  customers: User[],
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
      render: (_text: string, record: User) => moment(record.createdAt).format('lll')
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
      <div className="pageHeader">
        <h2>Clientes</h2>
      </div>
      <div className="pageHeader">
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder='Buscar clientes...' className='input' type="text" />
      </div>
      {
        query.search &&
        <div className="pageHeader">
          <div
            onClick={() => {
              push(`/admin/customers?page=1&limit=20`);
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

  const req = nextReq as any

  let users = []

  try {
    const { data } = await api.get(`/api/users?role=customer&page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    users = data.users

  } catch (error) {
    console.log({ error })
    // return {
    //   redirect: {
    //     destination: '/',
    //     permanent: false,
    //   },
    // };
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