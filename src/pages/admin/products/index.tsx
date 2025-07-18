import Layout from "@/components/admin/Layout"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { ProductInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import toast from "react-hot-toast"
import { getServerSideToken } from "@/utils/getServerSideToken"
import { makeRequest } from "@/utils/makeRequest"
import { Chip, Modal, Page, Table } from "@/components/common"
import { ProductModal } from "@/components/admin/products/ProductModal"
import { usePermissions } from "@/hooks/usePermissions"

interface Props {
  products: ProductInterface[],
  page: number,
  limit: number,
  batchSize: number,
  totalRecords: number,
  error: {
    error: number,
    message: string
  }
}

const ProductsAdminPage = ({ products = [], page, limit, totalRecords, batchSize, error }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

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
  ]

  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'products', limit })

  const { push, query, replace, pathname } = useRouter()

  const { canCreate } = usePermissions();

  return (
    <>
      <Page
        title="Productos"
        primaryAction={{
          name: "Nuevo producto",
          onClick: () => {
            setVisible(true)
          },
          visible: canCreate
        }}
        search={{
          handleSearch,
          searchTerm,
          onClearSearch: () => {
            push(`/admin/products?page=1&limit=20`);
            setSearchTerm('')
          }
        }}
      >
        <Table
          columns={columns}
          data={products}
          navigateTo="admin/products"
          paramKey="code"
          batchSize={batchSize}
          totalRecords={totalRecords}
          page={page}
          limit={limit}
        />
      </Page>
      <ProductModal
        title="Nuevo producto"
        visible={visible}
        setVisible={setVisible}
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

  let errorCode = null;

  let errorMessage = null;

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/public/products?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token
        // "x-location": "admin"
      }
    })

    products = data.products

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