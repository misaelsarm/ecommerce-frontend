import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import { ValueInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import Chip from "@/components/common/Chip"
import { getServerSideToken } from "@/utils/getServerSideToken"
import Checkbox from "@/components/common/Checkbox"
import { AuthContext } from "@/context/auth/AuthContext"
import { hasPermission } from "@/utils/hasPermission"
import { makeRequest } from "@/utils/makeRequest"

interface Props {
  value: ValueInterface
}

const ValueDetailsAdminPage = ({ value }: Props) => {

  const [editing, setEditing] = useState(false)

  const [type, setType] = useState<'option' | 'color' | ''>(value.type.value)

  const { user } = useContext(AuthContext)

  const { replace, back, pathname } = useRouter()

  const canCreateEdit = user.role?.value === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

  const { register, handleSubmit, control, resetField, formState: { errors }, reset } = useForm<any>({
    defaultValues: {
      type: value.type,
      label: value.label,
      value: value.value,
      active: value.active,
    }
  });

  const [saving, setSaving] = useState(false)

  const onSubmit = async (values: any) => {

    setSaving(true)

    try {
      const update = {
        ...values,
      }
      await makeRequest('put', `/api/values/${value._id}`, update)
      toast.success('Valor actualizado')
      setSaving(false)
      setEditing(false)
      replace(`/admin/values/${value._id}`)
    } catch (error: any) {
      setSaving(false)
      toast.error(error.response.data.message)
    }
  }

  const renderForm = () => {
    return (
      <>
        <Select
          control={control}
          errors={errors}
          required
          options={[
            {
              label: 'Color',
              value: 'color'
            },
            {
              label: 'Opcion',
              value: 'option'
            },
          ]}
          name="type"
          label="Tipo de valor"
          onChange={(e: any) => {
            setType(e.value)
          }}
        />
        <Input
          register={register}
          label={`Nombre de ${type === 'color' ? 'color' : 'opción'}`}
          placeholder=''
          name='label'
          errors={errors}
          required
        />
        {
          type === 'color' &&
          <div className="group">
            <Input
              label='Código de color'
              name='value'
              type='color'
              register={register}
              placeholder=''
              errors={errors}
              required
            />
          </div>
        }
        <Checkbox
          label='Activo'
          id='active'
          name='active'
          register={register}
          defaultChecked={value.active}
        />
      </>
    )
  }

  return (
    <>
      <div className='detailPage'>
        <>
          <div className="page-actions">
            <button
              style={{
                cursor: 'pointer'
              }}
              onClick={() => {
                back()
              }}
              className='back'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg></button>
            {
              !editing && canCreateEdit &&
              <button className='btn btn-black' onClick={async () => {
                setEditing(true)
              }}>Editar</button>
            }
          </div>
          <div className="card">
            <>
              <div className="cardItem">
                <h4>Nombre</h4>
                <span>{value.label}</span>
              </div>
              <div className="cardItem">
                <h4>Tipo de valor</h4>
                <span>{value.type.label}</span>
              </div>
              {
                value.type.value === 'color' &&
                <div className="cardItem">
                  <h4>Código de color</h4>
                  <div className="d-flex align-center">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: value.value,
                        borderRadius: 5,
                        marginRight: 15
                      }}
                    ></div>
                    <span>{value.value}</span>
                  </div>
                </div>
              }
              <div className="cardItem">
                <h4>Estado</h4>
                {
                  value.active ? <Chip text='activo' color='green' /> : <Chip text='no activo' />
                }
              </div>
            </>
          </div>
        </>
      </div >
      <Modal
        visible={editing}
        loadingState={saving /* || uploading */}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar atributo'
        onClose={() => {
          setEditing(false)
        }}
      >
        {renderForm()}
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, params }) => {

  const id = params?.id

  let value

  const token = getServerSideToken(req)

  try {
    const data = await makeRequest('get', `/api/values/${id}`, {}, {
      headers: {
        "x-access-token": token,
      },
    })

    value = data.value

  } catch (error) {

  }

  return {
    props: {
      value
    }
  }
}

ValueDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="ValueDetailsAdminPage">
      {page}
    </Layout>
  );
};

export default ValueDetailsAdminPage