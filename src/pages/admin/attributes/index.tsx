
import AddAttribute from "@/components/admin/attributes/AddAttribute"
import Layout from "@/components/admin/Layout"
import PageHeader from "@/components/admin/PageHeader"
import AddProduct from "@/components/admin/products/AddProduct"
import Table from "@/components/admin/Table"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { AttributeInterface, ProductInterface } from "@/interfaces"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"

interface Props {
  attributes: ProductInterface[],
  page: number,
  limit: number,
  size: number
}

const AttributesAdminPage = ({ attributes = [], page, limit, size }: Props) => {

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'shortName',
      key: 'shortName'
    },
    {
      title: 'Nombre largo',
      dataIndex: 'longName',
      key: 'longName'
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (text: string, record: AttributeInterface) => record.type.label
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (text: string, record: AttributeInterface) => (
        <Link href={`/attributes/${record.id}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
  ]

  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'attributes', limit })

  const { push, query, replace } = useRouter()

  return (
    <>
      <div className="page">
        <PageHeader
          title='Atributos'
          actions={
            [
              {
                name: "Nuevo atributo",
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
            push(`/admin/attributes?page=1&limit=20`);
            setSearchTerm('')
          }}
        />
        <div className="pageContent">
          <Table
            columns={columns}
            data={attributes}
            navigateTo="attributes"
            size={size}
            page={page}
            limit={limit}
          />
        </div>
      </div>
      <AddAttribute
        visible={visible}
        setVisible={setVisible}
        onOk={() => {
          setVisible(false)
          replace('/admin/attributes?page=1&limit=20')
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

AttributesAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Atributos">
      {page}
    </Layout>
  );
};

export default AttributesAdminPage