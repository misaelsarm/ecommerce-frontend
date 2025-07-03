import Layout from "@/components/admin/Layout"
import Input from "@/components/common/Input/Input"
import Modal from "@/components/common/Modal/Modal"
import Select from "@/components/common/Select/Select"
import { ValueInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Chip from "@/components/common/Chip/Chip"
import Checkbox from "@/components/common/Checkbox/Checkbox"
import { makeRequest } from "@/utils/makeRequest"
import { valueTypesMap } from "@/utils/mappings"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import Page from "@/components/common/Page/Page"
import { valueTypes } from "@/utils/catalogs"
import Card from "@/components/common/Card/Card"
import CardItem from "@/components/common/CardItem/CardItem"

interface Props {
  value: ValueInterface
  error: {
    message: string
    error: number
  }
}

const ValueDetailsAdminPage = ({ value, error }: Props) => {

  if (error) {
    return <Page>{error.message}</Page>
  }

  const [editing, setEditing] = useState(false)

  const [type, setType] = useState(value.type)

  const { replace, back } = useRouter()

  const { register, handleSubmit, control, resetField, formState: { errors }, reset } = useForm<any>({
    defaultValues: {
      type: {
        label: valueTypesMap[value.type],
        value: value.type
      },
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
        type: values.type.value
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
          options={valueTypes}
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
      <Page
        fullWidth={false}
        maxwidth="700px"
        title={`Valor: ${value.label}`}
        primaryAction={{
          name: "Editar",
          onClick: () => {
            setEditing(true)
          },
          //disabled: !canEdit
        }}
      >
        <Card>
          <CardItem
            title="Nombre"
            content={<span>{value.label}</span>}
          />
          <CardItem
            title="Tipo de valor"
            content={<span>{valueTypesMap[value.type]}</span>}
          />
          {
            value.type === 'color' &&
            <CardItem
              title="Código de color"
              content={
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
              }
            />
          }
          <CardItem
            title="Estado"
            content={
              value.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
            }
          />
        </Card>
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
    endpoint: '/api/admin/values/:id',
    dataKey: 'value',
    propKey: 'value'
  })
}

ValueDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Valores | ${page.props.value?.label}`}>
      {page}
    </Layout>
  );
};

export default ValueDetailsAdminPage