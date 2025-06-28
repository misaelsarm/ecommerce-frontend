import Layout from "@/components/admin/Layout"
import PageHeader from "@/components/common/PageHeader/PageHeader"
import AddProduct from "@/components/admin/products/AddProduct"
import Table from "@/components/common/Table/Table"
import Modal from "@/components/common/Modal/Modal"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { ProductInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement, useContext, useState } from "react"
import toast from "react-hot-toast"
import Cookies from "js-cookie";
import { getServerSideToken } from "@/utils/getServerSideToken"
import Chip from "@/components/common/Chip/Chip"
import { hasPermission } from "@/utils/hasPermission"
import { AuthContext } from "@/context/auth/AuthContext"
import { makeRequest } from "@/utils/makeRequest"

interface Props {
  products: ProductInterface[],
  page: number,
  limit: number,
  batchSize: number,
  totalRecords: number
}

const ProductsAdminPage = ({ products = [], page, limit, totalRecords, batchSize }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const { user } = useContext(AuthContext)

  const [loading, setLoading] = useState(false)

  const [deletedProduct, setDeletedProduct] = useState({} as ProductInterface)

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
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (_text: string, record: ProductInterface) => record.price ? <>{`${record.price} MXN`}</> : 'N/A',
    },
    {
      title: 'Colleciones',
      dataIndex: 'collections',
      key: 'collections',
      render: (text: string, record: ProductInterface) => record.collections.length
    },
    {
      title: 'Estado',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: ProductInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
        }
      </div>
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: ProductInterface) => (
        <Link href={`/admin/products/${record.code}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    }
  ]

  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'products', limit })

  const { push, query, replace, pathname } = useRouter()

  if (hasPermission(pathname, 'delete', user.permissions) || user.role === 'admin') {
    columns.push({
      title: 'Eliminar',
      dataIndex: 'eliminar',
      key: 'eliminar',
      render: (_text: string, record: ProductInterface) => (
        <button onClick={() => {
          setConfirmDelete(true)
          setDeletedProduct(record)
        }} className="btn">Eliminar</button>
      )
    },)
  }

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
            batchSize={batchSize}
            totalRecords={totalRecords}
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
      <Modal
        loadingState={loading}
        title="Eliminar producto"
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
            setLoading(true)
            await makeRequest('put', `/api/products/${deletedProduct._id}`, { deleted: true })
            toast.success(`Se elimino el producto ${deletedProduct.name}`)
            setConfirmDelete(false);
            setDeletedProduct({} as ProductInterface);
            replace('/admin/products?page=1&limit=20')
            setLoading(false)
          } catch (error: any) {
            setLoading(false)
            toast.error(error.response.data.message)
          }
        }}
      >
        <div><span>¿Confirmar eliminación del producto <b>{deletedProduct.name}</b>? Esta acción no se puede deshacer.</span></div>
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let data

  let products = []

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/products?page=${page}&limit=${limit}&search=${search}`, {}, {
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
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
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