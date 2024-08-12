import { api } from '@/api_config/api'
import AddCollection from '@/components/admin/collections/AddCollection'
import Layout from '@/components/admin/Layout'
import PageHeader from '@/components/admin/PageHeader'
import Table from '@/components/admin/Table'
import Modal from '@/components/common/Modal'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { CollectionInterface } from '@/interfaces'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from "js-cookie";

interface Props {
  collections: CollectionInterface[],
  page: number,
  limit: number,
  size: number
}

const CollectionsAdminPage = ({ collections = [], page, limit, size }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [deletedCollection, setDeletedCollection] = useState({} as CollectionInterface)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'collections', limit })

  const [visible, setVisible] = useState(false)

  const { push, query, replace } = useRouter()

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      key: 'image',
      render: (_text: string, record: CollectionInterface) => (
        <Image
          width={80}
          height={80}
          style={{
            objectFit: 'contain'
          }}
          src={record.image}
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
      title: 'Activa',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: CollectionInterface) => record.active ? 'Activa' : 'No Publicada'
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: CollectionInterface) => (
        <Link href={`/admin/collections/${record.code}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
    {
      title: 'Eliminar',
      dataIndex: 'eliminar',
      key: 'eliminar',
      render: (_text: string, record: CollectionInterface) => (
        <button onClick={() => {
          setConfirmDelete(true)
          setDeletedCollection(record)
        }} className="btn">Eliminar</button>
      )
    },
  ]

  return (
    <>
      <div className="page">
        <PageHeader
          title='Colecciones'
          actions={
            [
              {
                name: "Nueva colección",
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
            push(`/admin/collections?page=1&limit=20`);
            setSearchTerm('')
          }}
        />
        <div className="pageContent">
          <Table
            columns={columns}
            data={collections}
            size={size}
            page={page}
            limit={limit}
            navigateTo="collections"
          />
        </div>
      </div>
      <AddCollection
        visible={visible}
        setVisible={setVisible}
        onOk={() => {
          setVisible(false)
          replace('/admin/collections?page=1&limit=20')
        }}
      />
      <Modal
        title="Eliminar colección"
        bodyStyle={{
          height: 'auto',
          width: 400
        }}
        visible={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onCancel={() => setConfirmDelete(false)}
        onOk={async () => {
          try {
            await api.put(`/api/collections/${deletedCollection.id}`, { deleted: true }, {
              headers: {
                'x-access-token': Cookies.get('token')
              }
            })
            toast.success(`Se elimino la colección ${deletedCollection.name}`)
            setConfirmDelete(false);
            setDeletedCollection({} as CollectionInterface);
            replace('/admin/collections?page=1&limit=20')
          } catch (error: any) {
            toast.error(error.response.data.message)
          }
        }}
      >
        <div><span>¿Confirmar eliminación de la colección <b>{deletedCollection.name}</b>? Esta acción no se puede deshacer.</span></div>
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let collections = []

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

    const { data } = await api.get(`/api/collections?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        "x-access-token": token
        //"x-location": "admin"
      }
    })
    collections = data.collections

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
      collections,
      page: Number(page),
      limit: Number(limit),
      size: Number(collections.length),
    },
  };
}

CollectionsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Colecciones">
      {page}
    </Layout>
  );
};

export default CollectionsAdminPage