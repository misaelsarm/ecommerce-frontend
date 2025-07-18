import Layout from "@/components/admin/Layout"
import { ValueModal } from "@/components/admin/values/ValueModal"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { ValueInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import toast from "react-hot-toast"
import { getServerSideToken } from "@/utils/getServerSideToken"
import { makeRequest } from "@/utils/makeRequest"
import { valueTypesMap } from "@/utils/mappings"
import { Chip, Modal, Page, Table } from "@/components/common"
import { usePermissions } from "@/hooks/usePermissions"

interface Props {
  values: ValueInterface[],
  page: number,
  limit: number,
  error: {
    error: number,
    message: string
  }
  batchSize: number,
  totalRecords: number
}

const ValuesAdminPage = ({ values = [], page, limit, batchSize, totalRecords, error }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [deletedValue, setDeletedValue] = useState({} as ValueInterface)

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'label',
      key: 'label',
      render: (text: string, record: ValueInterface) => record.type === 'color' ? <div className="d-flex align-center">
        <div
          style={{
            width: 30,
            height: 30,
            backgroundColor: record.value,
            borderRadius: 5,
            marginRight: 15
          }}
        ></div>
        <span>{text}</span>
      </div> : text
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (text: string, record: ValueInterface) => valueTypesMap[record.type]
    },
    {
      title: 'Estado',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: ValueInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
        }
      </div>
    }

  ]
  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'values', limit })

  const { push, replace } = useRouter()

  const { canCreate } = usePermissions();

  return (
    <>
      {
        error ? <Page>{error.message}</Page> : <>
          <Page
            title="Valores de atributos"
            primaryAction={{
              name: "Nuevo valor",
              onClick: () => {
                setVisible(true)
              },
              visible: canCreate
            }}
            search={{
              searchTerm,
              handleSearch,
              onClearSearch: () => {
                push(`/admin/values?page=1&limit=20`);
                setSearchTerm('')
              }
            }}
          >
            <Table
              columns={columns}
              data={values}
              navigateTo="admin/values"
              batchSize={batchSize}
              totalRecords={totalRecords}
              page={page}
              limit={limit}
              paramKey="_id"
            />
          </Page>
          <ValueModal
            visible={visible}
            setVisible={setVisible}
            title="Nuevo valor"
          />
          <Modal
            title="Eliminar valor de atributo"
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
                await makeRequest('put', `/api/values/${deletedValue._id}`, { deleted: true })
                toast.success(`Se elimino el valor ${deletedValue.label}`)
                setConfirmDelete(false);
                setDeletedValue({} as ValueInterface);
                replace('/admin/values?page=1&limit=20')
              } catch (error: any) {
                toast.error(error.response.data.message)
              }
            }}
          >
            <div><span>¿Confirmar eliminación del valor <b>{deletedValue.label}</b>? Esta acción no se puede deshacer.</span></div>
          </Modal>
        </>
      }
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let values = []

  let errorCode = null;

  let errorMessage = null;

  let data

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/admin/values?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token
        //"x-location": "admin"
      }
    })
    values = data.values

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
      values,
      page: Number(page),
      limit: Number(limit),
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
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