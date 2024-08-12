import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import PageHeader from "@/components/admin/PageHeader"
import Table from "@/components/admin/Table"
import AddValue from "@/components/admin/values/AddValue"
import Modal from "@/components/common/Modal"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { ValueInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import toast from "react-hot-toast"
import Cookies from "js-cookie";

interface Props {
  values: ValueInterface[],
  page: number,
  limit: number,
  size: number
}

const ValuesAdminPage = ({ values = [], page, limit, size }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [deletedValue, setDeletedValue] = useState({} as ValueInterface)

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
      render: (text: string, record: ValueInterface) => record.active ? 'Activo' : 'No Publicado'
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: ValueInterface) => (
        <Link href={`/admin/values/${record.id}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
    {
      title: 'Eliminar',
      dataIndex: 'eliminar',
      key: 'eliminar',
      render: (_text: string, record: ValueInterface) => (
        <button onClick={() => {
          setConfirmDelete(true)
          setDeletedValue(record)
        }} className="btn">Eliminar</button>
      )
    },
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
            await api.put(`/api/collections/${deletedValue.id}`, { deleted: true }, {
              headers: {
                'x-access-token': Cookies.get('token')
              }
            })
            toast.success(`Se elimino el valor ${deletedValue.label}`)
            setConfirmDelete(false);
            setDeletedValue({} as ValueInterface);
          } catch (error: any) {
            toast.error(error.response.data.message)
          }
        }}
      >
        <div><span>¿Confirmar eliminación del valor <b>{deletedValue.label}</b>? Esta acción no se puede deshacer.</span></div>
      </Modal>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let values = []

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

    const { data } = await api.get(`/api/values?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        "x-access-token": token
        //"x-location": "admin"
      }
    })
    values = data.values

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
      values,
      page: Number(page),
      limit: Number(limit),
      size: Number(values.length),
    },
  };
}

ValuesAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Valores de atributos">
      {page}
    </Layout>
  );
};

export default ValuesAdminPage