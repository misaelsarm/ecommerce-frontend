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
import React, { ReactElement, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { getServerSideToken } from '@/utils/getServerSideToken'
import Chip from '@/components/common/Chip'
import { AuthContext } from '@/context/auth/AuthContext'
import { hasPermission } from '@/utils/hasPermission'
import { makeRequest } from '@/utils/makeRequest'

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

  const { push, query, replace, pathname } = useRouter()

  const { user } = useContext(AuthContext)

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
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (_text: string, record: CollectionInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
        }
      </div>
    },
    /*     {
          title: 'Colección agrupadora',
          dataIndex: 'parentCollection',
          key: 'parentCollection',
          render: (_text: string, record: CollectionInterface) => <div className='d-flex flex-column align-start'>
            {
              record.parentCollection && <Chip text={record.parentCollection.name} />
            }
          </div>
        }, */
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: CollectionInterface) => (
        <Link href={`/admin/collections/${record.code}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    }
  ]


  if (hasPermission(pathname, 'delete', user.permissions) || user.role === 'admin') {
    columns.push({
      title: 'Eliminar',
      dataIndex: 'eliminar',
      key: 'eliminar',
      render: (_text: string, record: CollectionInterface) => (
        <button onClick={() => {
          setConfirmDelete(true)
          setDeletedCollection(record)
        }} className="btn">Eliminar</button>
      )
    })
  }


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
        wrapperStyle={{
          height: 'auto',
          width: 400
        }}
        bodyStyle={{
          height: 'auto'
        }}
        visible={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onCancel={() => setConfirmDelete(false)}
        onOk={async () => {
          try {
            await makeRequest('put', `/api/collections/${deletedCollection._id}`, { deleted: true })
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

    const token = getServerSideToken(nextReq)

    const data = await makeRequest('get', `/api/collections?page=${page}&limit=${limit}&search=${search}`, {}, {
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