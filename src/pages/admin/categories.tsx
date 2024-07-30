
import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import PageLinks from '@/components/admin/PageLinks'
import Table from '@/components/admin/Table'
import AddCategory from '@/components/admin/categories/AddCategory'
import { Category } from '@/interfaces'
import debounce from 'lodash.debounce'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'

interface Props {
  categories: Category[],
  page: number,
  limit: number,
  size: number
}

const CategoriesAdminPage = ({ categories, page, limit, size }: Props) => {

  const [visible, setVisible] = useState(false)

  const [currentEditing, setCurrentEditing] = useState({} as any)

  const { push, query, replace } = useRouter()

  const [searchTerm, setSearchTerm] = useState(query.search)

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        push(`/admin/categories?page=1&limit=20`);
      } else {
        push(`/admin/categories?search=${searchTerm}`);
      }
    }, 500),
    [limit]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    debouncedSearch(searchTerm);
  };

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      key: 'image',
      render: (_text: string, record: any) =>
        <img
          loading="lazy"
          style={{ width: 80 }}
          src={record.image}
          alt={record.name}
        />
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Activa',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: any) => record.active ? 'Activa' : 'No Publicada'
    },
    {
      title: 'Editar',
      dataIndex: 'edit',
      key: 'edit',
      render: (_text: string, record: any) => (
        <button
          onClick={() => {
            setVisible(true)
            setCurrentEditing(record)
          }}
          className="btn btn-black">Editar</button>
      )
    },
  ]

  return (
    <>
      <div className="page">
        <PageLinks />
        <div className="pageHeader">
          <h2>Categorías</h2>
          <button onClick={() => {
            setVisible(true)
          }} className="btn btn-pink">Nueva Categoría</button>
        </div>
        <div className="pageHeader">
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Buscar categorías...' className='input' type="text" />
        </div>
        {
          query.search &&
          <div className="pageHeader">
            <div
              onClick={() => {
                push(`/admin/categories?page=1&limit=20`);
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
            data={categories}
            size={size}
            page={page}
            limit={limit}
            navigateTo="categories"
          />
        </div>
      </div>
      <AddCategory
        visible={visible}
        setVisible={setVisible}
        currentEditing={currentEditing}
        onOk={() => {
          setVisible(false)
          replace('/admin/categories?page=1&limit=20')
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  const req = nextReq as any

  let categories = []

  try {
    const { data } = await api.get(`/api/categories?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    categories = data.categories

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
      categories,
      page: Number(page),
      limit: Number(limit),
      size: Number(categories.length),
    },
  };
}

CategoriesAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Categorías">
      {page}
    </Layout>
  );
};

export default CategoriesAdminPage