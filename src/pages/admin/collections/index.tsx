import { CollectionModal } from '@/components/admin/collections/CollectionModal'
import Layout from '@/components/admin/Layout'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { CollectionInterface } from '@/interfaces'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import toast from 'react-hot-toast'
import { getServerSideToken } from '@/utils/getServerSideToken'
import { makeRequest } from '@/utils/makeRequest'
import { Chip, Modal, Page, Table } from '@/components/common'
import { usePermissions } from '@/hooks/usePermissions'

interface Props {
  collections: CollectionInterface[],
  page: number,
  limit: number,
  batchSize: number,
  totalRecords: number,
  error: {
    error: number,
    message: string
  }
}

const CollectionsAdminPage = ({ collections = [], page, limit, batchSize, totalRecords, error }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [deletedCollection, setDeletedCollection] = useState({} as CollectionInterface)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'collections', limit })

  const [visible, setVisible] = useState(false)

  const { push, replace } = useRouter()

  const { canCreate } = usePermissions();

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
  ]

  return (
    <>
      <Page
        title='Colecciones'
        search={{
          handleSearch,
          searchTerm,
          onClearSearch: () => {
            push(`/admin/collections?page=1&limit=20`);
            setSearchTerm('')
          }
        }}
        primaryAction={{
          name: 'Nueva colección',
          onClick: () => setVisible(true),
          visible: canCreate
        }}
      >
        <Table
          columns={columns}
          data={collections}
          batchSize={batchSize}
          totalRecords={totalRecords}
          page={page}
          limit={limit}
          navigateTo="admin/collections"
          paramKey='code'
        />
      </Page>
      <CollectionModal
        title='Nueva colección'
        visible={visible}
        setVisible={setVisible}
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

  let errorCode = null;

  let errorMessage = null;

  let data

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/public/collections?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token
      }
    })
    collections = data.collections

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
      collections,
      page: Number(page),
      limit: Number(limit),
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
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