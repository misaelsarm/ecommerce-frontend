import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import PageHeader from "@/components/admin/PageHeader"
import AddProduct from "@/components/admin/products/AddProduct"
import Table from "@/components/admin/Table"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { ProductInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"

interface Props {
  products: ProductInterface[],
  page: number,
  limit: number,
  size: number
}

const ProductsAdminPage = ({ products = [], page, limit, size }: Props) => {

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      key: 'image',
      render: (_text: string, record: ProductInterface) => (
        <Image
          width={80}
          height={80}
          style={{
            objectFit: 'contain'
          }}
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
      render: (_text: string, record: ProductInterface) => record.price ? <>{`${record.price} MXN`}</> : 'N/A',
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: ProductInterface) => record.active ? 'Activo' : 'No activo'
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: ProductInterface) => (
        <Link href={`/admin/products/${record.code}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
  ]
  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'products', limit })

  const { push, query, replace } = useRouter()

  return (
    <>
      <div className="page">
        <PageHeader
          title='Productos'
          actions={
            [
              {
                name: "Nuevo producto",
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
            push(`/admin/products?page=1&limit=20`);
            setSearchTerm('')
          }}
        />
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

  let products = []

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


    const { data } = await api.get(`/api/products?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        "x-access-token": token
        // "x-location": "admin"
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