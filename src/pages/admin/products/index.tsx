import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import PageLinks from '@/components/admin/PageLinks'
import Table from '@/components/admin/Table'
import AddProduct from '@/components/admin/products/AddProduct'
import { Product } from '@/interfaces'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'
import debounce from 'lodash.debounce';

interface Props {
  products: Product[],
  page: number,
  limit: number,
  size: number
}

const ProductsAdminPage = ({ products, page, limit, size }: Props) => {

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      key: 'image',
      render: (_text: string, record: Product) => (
        <img
          loading="lazy"
          style={{ width: 50, height: 50, objectFit: 'contain' }}
          src={record.images[0]}
          alt=''
        />
      )
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
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (_text: string, record: Product) => record.price ? <>{`${record.price} MXN`}</> : 'N/A',
    },
    {
      title: 'Subcategorías',
      dataIndex: 'subCategories',
      key: 'subCategories',
      render: (_text: string, record: Product) =>
        record.subCategories.map(sub => (
          <li key={sub.name}>{sub.name}</li>
        ))

    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: Product) => record.active ? 'Activo' : 'No activo'
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: Product) => (
        <Link href={`/admin/products/${record.code}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
  ]
  const [visible, setVisible] = useState(false)

  const { push, query, replace } = useRouter()

  const [searchTerm, setSearchTerm] = useState(query.search)

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        push(`/admin/products?page=1&limit=20`);
      } else {
        push(`/admin/products?search=${searchTerm}`);
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
    <>
      <div className="page">
        <PageLinks />
        <div className="pageHeader">
          <h2>Productos  </h2>
          <button onClick={() => {
            setVisible(true)
          }} className="btn btn-pink">Nuevo producto</button>
        </div>
        <div className="pageHeader">
        </div>
        <div className="pageHeader">
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Buscar productos...' className='input' type="text" />
        </div>
        {
          query.search &&
          <div className="pageHeader">
            <div
              onClick={() => {
                push(`/admin/products?page=1&limit=20`);
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
            data={products}
            navigateTo="products"
            size={size}
            page={page}
            limit={limit}
          />
        </div>
      </div>

      <AddProduct
        visible={visible}
        setVisible={setVisible}
        onOk={() => {
          setVisible(false)
          replace('/admin/products?page=1&limit=20')
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  const req = nextReq as any

  let products = []

  try {
    const { data } = await api.get(`/api/products?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    products = data.products

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
      products,
      page: Number(page),
      limit: Number(limit),
      size: Number(products.length),
    },
  };
}

ProductsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Productos">
      {page}
    </Layout>
  );
};

export default ProductsAdminPage