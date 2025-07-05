import {AttributeModal} from "@/components/admin/attributes/AttributeModal"
import Layout from "@/components/admin/Layout"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { AttributeInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import toast from "react-hot-toast"
import { getServerSideToken } from "@/utils/getServerSideToken"
import { makeRequest } from "@/utils/makeRequest"
import { attributeTypesMap } from "@/utils/mappings"
import { Chip, Modal, Page, Table } from "@/components/common"

interface Props {
  attributes: AttributeInterface[],
  page: number,
  limit: number,
  batchSize: number
  totalRecords: number,
  error?: {
    error: number,
    message: string
  }
}

const AttributesAdminPage = ({ attributes = [], page, limit, batchSize, totalRecords, error }: Props) => {

  const [confirmDelete, setConfirmDelete] = useState(false)

  const [deletedAttribute, setDeletedAttribute] = useState({} as AttributeInterface)

  const [visible, setVisible] = useState(false)

  const { searchTerm, setSearchTerm, handleSearch } = useDebouncedSearch({ url: 'attributes', limit })

  const { push, replace } = useRouter()

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
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: AttributeInterface) => <div className='d-flex flex-column align-start'>
        {
          record.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
        }
      </div>
    },
  ]

  return (
    <>
      {
        error ?
          <Page>
            {error.message}
          </Page> :
          <>
            <Page
              title="Atributos"
              primaryAction={{
                name: "Nuevo atributo",
                onClick: () => {
                  setVisible(true)
                },
                //disabled: !hasPermission(pathname, 'create', user.permissions) && user.role !== 'admin'
              }}
              search={{
                handleSearch,
                searchTerm,
                onClearSearch: () => {
                  push(`/admin/attributes?page=1&limit=20`);
                  setSearchTerm('')
                }
              }}
            >
              <Table
                columns={columns}
                data={attributes}
                navigateTo="admin/attributes"
                paramKey="_id"
                batchSize={batchSize}
                page={page}
                limit={limit}
                totalRecords={totalRecords}
              />
            </Page>
            <AttributeModal
              visible={visible}
              setVisible={setVisible}
              onOk={() => {
                setVisible(false)
                replace('/admin/attributes?page=1&limit=20')
              }}
              title="Nuevo atributo"
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
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  let attributes = []

  let errorCode = null;
  let errorMessage = null;

  let data

  try {

    const token = getServerSideToken(nextReq)

    data = await makeRequest('get', `/api/admin/attributes?page=${page}&limit=${limit}&search=${search}`, {}, {
      headers: {
        "x-access-token": token
        //"x-location": "admin"
      }
    })

    attributes = data.attributes

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
      attributes,
      page: Number(page),
      limit: Number(limit),
      batchSize: data.batchSize,
      totalRecords: data.totalRecords
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