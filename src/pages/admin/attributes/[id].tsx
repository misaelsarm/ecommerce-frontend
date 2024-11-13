import Layout from "@/components/admin/Layout"
import Checkbox from "@/components/common/Checkbox"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import { AttributeInterface, ValueInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Chip from "@/components/common/Chip"
import { getServerSideToken } from "@/utils/getServerSideToken"
import { attributeTypes } from "@/utils/attributeTypes"
import { hasPermission } from "@/utils/hasPermission"
import { AuthContext } from "@/context/auth/AuthContext"
import { makeRequest } from "@/utils/makeRequest"
import { attributeTypesMap } from "@/utils/mappings"

interface Props {
  attribute: AttributeInterface
}

const AttributeDetailsAdminPage = ({ attribute }: Props) => {

  async function fetchData() {
    try {
      const data = await makeRequest('get', '/api/values')
      setValues(data.values)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  const [editing, setEditing] = useState(false)

  const { user } = useContext(AuthContext)

  const [values, setValues] = useState([] as ValueInterface[])

  const [type, setType] = useState()

  const { register, handleSubmit, control, resetField, formState: { errors }, reset } = useForm<any>({
    defaultValues: {
      longName: attribute.longName,
      shortName: attribute.shortName,

      max: attribute.max,
      values: attribute.values.map(val => ({
        label: val.label,
        value: val._id
      })),
      active: attribute.active,
      type: {
        label: attributeTypesMap[attribute.type],
        value: attribute.type
      }
    }
  });

  const [saving, setSaving] = useState(false)

  const { replace, back, pathname } = useRouter()

  const onSubmit = async (values: any) => {

    setSaving(true)
    try {
      const update = {
        ...values,
        values: values.values?.map((value: any) => value.value),
        type: values.type.value
      }
      await makeRequest('put', `/api/attributes/${attribute._id}`, update)
      toast.success('Atributo actualizado')
      setEditing(false)
      setSaving(false)
      replace(`/admin/attributes/${attribute._id}`)
    } catch (error: any) {
      setSaving(false)
      toast.error(error.response.data.message)
    }
  }

  const renderForm = () => {
    return (
      <>
        <Input
          register={register}
          label='Nombre corto'
          name='shortName'
          errors={errors}
          required
        />
        <Input
          register={register}
          label='Nombre largo'
          name='longName'
          errors={errors}
          required
        />
        <Select
          label="Tipo de atributo"
          options={attributeTypes}
          name="type"
          control={control}
          required
          errors={errors}
          onChange={(e: any) => {
            setType(e.value)
            resetField('values')
          }}
        />
        {
          type === 'color' &&
          <Select
            label="Valores de atributo"
            options={values.filter((option) => {
              return option.type === 'color'
            }).map((item) => ({
              label: item.label,
              value: item._id
            }))}
            name="values"
            control={control}
            required
            errors={errors}
            isMulti
          />
        }
        {
          type === 'dropdown' &&
          <Select
            label="Valores de atributo"
            options={values.filter((option) => {
              return option.type === 'option'
            }).map((item) => ({
              label: item.label,
              value: item._id
            }))}
            name="values"
            control={control}
            required
            errors={errors}
            isMulti
          />
        }
        {
          (type === 'short-text' || type === 'long-text') &&
          <Input
            type='number'
            inputMode='numeric'
            register={register}
            label='Máximo de caracteres'
            placeholder='Máximo de caracteres'
            name='max'
            errors={errors}
          />
        }
        <Checkbox
          register={register}
          label='Activo'
          id='active'
          name='active'
          defaultChecked={attribute.active}
        />
      </>
    )
  }

  const canCreateEdit = user.role === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

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
              !editing && canCreateEdit && <button className='btn btn-black' onClick={async () => {
                setEditing(true)
                await fetchData()
              }}>Editar</button>
            }
          </div>
          <div className="card">
            <>
              <div className="cardItem">
                <h4>Nombre largo</h4>
                <span>{attribute.longName}</span>
              </div>
              <div className="cardItem">
                <h4>Nombre corto</h4>
                <span>{attribute.shortName}</span>
              </div>
              <div className="cardItem">
                <h4>Tipo de atributo</h4>
                <span>{attributeTypesMap[attribute.type]}</span>
              </div>
              {
                attribute.values.length > 0 &&
                <div className="cardItem">
                  <h4>Valores de atributo</h4>
                  <div>
                    {
                      attribute.values.map(col => (
                        <Chip key={col._id} text={col.label} />
                      ))
                    }
                  </div>
                </div>
              }
              {
                (type === 'short-text' || type === 'long-text') &&

                <div className="cardItem">
                  <h4>Máximo de caracteres permitidos</h4>
                  <span>{attribute.max}</span>
                </div>
              }
              <div className="cardItem">
                <h4>Estado</h4>
                {
                  attribute.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
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

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query, params }) => {

  const id = params?.id

  let attribute

  const token = getServerSideToken(nextReq)

  try {
    const data = await makeRequest('get', `/api/attributes/${id}`, {}, {
      headers: {
        "x-access-token": token,
      },
    })

    attribute = data.attribute

  } catch (error) {

  }

  return {
    props: {
      attribute
    }
  }
}

AttributeDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="AttributeDetailsAdminPage">
      {page}
    </Layout>
  );
};

export default AttributeDetailsAdminPage