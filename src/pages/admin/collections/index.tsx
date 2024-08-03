
import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import PageHeader from '@/components/admin/PageHeader'
import Table from '@/components/admin/Table'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { CollectionInterface } from '@/interfaces'
import debounce from 'lodash.debounce'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useState } from 'react'

interface Props {
  collections: CollectionInterface[],
  page: number,
  limit: number,
  size: number
}

const CollectionsAdminPage = ({ collections = [], page, limit, size }: Props) => {

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'collections', limit })

  const [visible, setVisible] = useState(false)

  const { push, query, replace } = useRouter()

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
    }
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
      {/* <AddCategory
        visible={visible}
        setVisible={setVisible}
        currentEditing={currentEditing}
        onOk={() => {
          setVisible(false)
          replace('/admin/collections?page=1&limit=20')
        }}
      /> */}
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

//   const { page, limit, search = '' } = query;

//   const req = nextReq as any

//   let collections = []

//   try {
//     const { data } = await api.get(`/api/collections?page=${page}&limit=${limit}&search=${search}`, {
//       headers: {
//         //@ts-ignore
//         "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
//         "x-location": "admin"
//       }
//     })
//     collections = data.collections

//   } catch (error) {
//     console.log({ error })
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       collections,
//       page: Number(page),
//       limit: Number(limit),
//       size: Number(collections.length),
//     },
//   };
// }

CollectionsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Colecciones">
      {page}
    </Layout>
  );
};

export default CollectionsAdminPage