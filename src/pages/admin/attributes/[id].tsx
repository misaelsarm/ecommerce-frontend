import Layout from "@/components/admin/Layout"
import { AttributeInterface, ValueInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { attributeTypes } from "@/utils/attributeTypes"
import { makeRequest } from "@/utils/makeRequest"
import { attributeTypesMap } from "@/utils/mappings"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import { AttributeType } from "@/utils/types"
import { Card, CardItem, Checkbox, Chip, Input, Modal, Page, Select } from "@/components/common"

interface Props {
  attribute: AttributeInterface,
  error?: {
    message: string
    error: number
  }
}

const AttributeDetailsAdminPage = ({ attribute, error }: Props) => {

  async function fetchData() {
    try {
      const data = await makeRequest('get', '/api/values')
      setValues(data.values)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  const [editing, setEditing] = useState(false)

  const [values, setValues] = useState([] as ValueInterface[])

  const [type, setType] = useState<AttributeType>(attribute.type)

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

  const { replace } = useRouter()

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
        />
      </>
    )
  }


  return (
    <>
      <Page
        title={`Detalles de atributo: ${attribute.longName}`}
        fullWidth={false}
        maxwidth="700px"
        primaryAction={{
          name: 'Editar',
          onClick: async () => {
            setEditing(true)
            await fetchData()
          },
          //visible: !editing && hasPermission('attributes', 'update')
        }}
        backAction
      >
        <>
          {/* <div className="page-actions">
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
              !editing && canEdit && <button className='btn btn-black' onClick={async () => {
                setEditing(true)
                await fetchData()
              }}>Editar</button>
            }
          </div> */}
          <Card>
            <CardItem
              title="Nombre largo"
              content={<span>{attribute.longName}</span>}
            />
            <CardItem
              title="Nombre corto"
              content={<span>{attribute.shortName}</span>}
            />
            <CardItem
              title="Tipo de atributo"
              content={<span>{attributeTypesMap[attribute.type]}</span>}
            />
            {
              attribute.values.length > 0 &&
              <CardItem
                title="Valores de atributo"
                content={
                  attribute.values.map(col => (
                    <Chip key={col._id} text={col.label} />
                  ))
                }
              >
              </CardItem>
            }
            {
              (type === 'short-text' || type === 'long-text') &&
              <CardItem
                title="Máximo de caracteres permitidos"
                content={<span>{attribute.max}</span>}
              />
            }
            {
              type === 'color' &&
              <CardItem
                title="Máximo de opciones permitidas"
                content={<span>{attribute.max}</span>}
              />
            }
            <CardItem
              title="Estado"
              content={
                attribute.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
              }
            />
          </Card>
        </>
      </Page>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return createServerSideFetcher(context, {
    endpoint: '/api/admin/attributes/:id',
    dataKey: 'attribute',
    propKey: 'attribute'
  })
}

AttributeDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Atributos | ${page.props.attribute?.shortName}`}>
      {page}
    </Layout>
  );
};

export default AttributeDetailsAdminPage