import AddAttribute from "@/components/admin/attributes/AddAttribute"
import Layout from "@/components/admin/Layout"
import PageHeader from "@/components/admin/PageHeader"
import Table from "@/components/admin/Table"
import Modal from "@/components/common/Modal"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { AttributeInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement, useContext, useState } from "react"
import toast from "react-hot-toast"
import Cookies from "js-cookie";
import { getServerSideToken } from "@/utils/getServerSideToken"
import Chip from "@/components/common/Chip"
import { hasPermission } from "@/utils/hasPermission"
import { AuthContext } from "@/context/auth/AuthContext"
import { makeRequest } from "@/utils/makeRequest"
import { attributeTypesMap } from "@/utils/mappings"

interface Props {
  attributes: AttributeInterface[],
  page: number,
  limit: number,
  size: number
}

const AttributesAdminPage = ({ attributes = [], page, limit, size }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [deletedAttribute, setDeletedAttribute] = useState({} as AttributeInterface)

  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'attributes', limit })

  const { push, query, replace, pathname } = useRouter()

  const { user } = useContext(AuthContext)

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
      render: (text: string, record: AttributeInterface) => attributeTypesMap[record.type]
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (_text: string, record: AttributeInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
        }
      </div>
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (text: string, record: AttributeInterface) => (
        <Link href={`/admin/attributes/${record._id}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },

  ]

  if (hasPermission(pathname, 'delete', user.permissions) || user.role === 'admin') {
    columns.push({
      title: 'Eliminar',
      dataIndex: 'eliminar',
      key: 'eliminar',
      render: (_text: string, record: AttributeInterface) => (
        <button onClick={() => {
          setConfirmDelete(true)
          setDeletedAttribute(record)
        }} className="btn">Eliminar</button>
      )
    },)
  }

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
      <Modal
        title="Eliminar atributo"
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
            await makeRequest('put', `/api/attributes/${deletedAttribute._id}`, { deleted: true })
            toast.success(`Se elimino el producto ${deletedAttribute.shortName}`)
            setConfirmDelete(false);
            setDeletedAttribute({} as AttributeInterface);
            replace('/admin/attributes?page=1&limit=20')
          } catch (error: any) {
            toast.error(error.response.data.message)
          }
        }}
      >
        <div><span>¿Confirmar eliminación del atributo <b>{deletedAttribute.shortName}</b>? Esta acción no se puede deshacer.</span></div>
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let attributes = []

  try {

    const token = getServerSideToken(nextReq)

    const data = await makeRequest('get', `/api/attributes?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token
        //"x-location": "admin"
      }
    })
    attributes = data.attributes

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
      attributes,
      page: Number(page),
      limit: Number(limit),
      size: Number(attributes.length),
    },
  };
}

AttributesAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Atributos">
      {page}
    </Layout>
  );
};

export default AttributesAdminPage