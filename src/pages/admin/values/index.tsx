import Layout from "@/components/admin/Layout"
import PageHeader from "@/components/admin/PageHeader"
import AddProduct from "@/components/admin/products/AddProduct"
import Table from "@/components/admin/Table"
import AddValue from "@/components/admin/values/AddValue"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { ValueInterface } from "@/interfaces"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"

interface Props {
  values: ValueInterface[],
  page: number,
  limit: number,
  size: number
}

const ValuesAdminPage = ({ values = [], page, limit, size }: Props) => {

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'label',
      key: 'label'
    },
    {
      title: 'Código',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
      render: (text: string, record: any) => record.active ? 'Activo' : 'No Publicado'
    },
    // {
    //   title: 'Editar',
    //   dataIndex: 'edit',
    //   key: 'edit',
    //   render: (text: string, record: any) => (
    //     <button
    //       onClick={() => {
    //         setVisible(true)
    //         setCurrentEditing(record)
    //       }}
    //       className="btn btn-black">Editar</button>
    //   )
    // },
  ]
  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'values', limit })

  const { push, query, replace } = useRouter()

  return (
    <>
      <div className="page">
        <PageHeader
          title='Valores de atributos'
          actions={
            [
              {
                name: "Nuevo valor",
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
            push(`/admin/values?page=1&limit=20`);
            setSearchTerm('')
          }}
        />
        <div className="pageContent">
          <Table
            columns={columns}
            data={values}
            navigateTo="values"
            size={size}
            page={page}
            limit={limit}
          />
        </div>
      </div>
      <AddValue
        visible={visible}
        setVisible={setVisible}
        onOk={() => {
          setVisible(false)
          replace('/admin/values?page=1&limit=20')
        }}
      />
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

//   const { page, limit, search = '' } = query;

//   const req = nextReq as any

//   let products = []

//   try {
//     const { data } = await api.get(`/api/products?page=${page}&limit=${limit}&search=${search}`, {
//       headers: {
//         //@ts-ignore
//         "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
//         "x-location": "admin"
//       }
//     })
//     products = data.products

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
//       products,
//       page: Number(page),
//       limit: Number(limit),
//       size: Number(products.length),
//     },
//   };
// }

ValuesAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Valores de atributos">
      {page}
    </Layout>
  );
};

export default ValuesAdminPage