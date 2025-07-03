import Layout from "@/components/admin/Layout"
import Checkbox from "@/components/common/Checkbox/Checkbox"
import Input from "@/components/common/Input/Input"
import Modal from "@/components/common/Modal/Modal"
import { UserInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Chip from "@/components/common/Chip/Chip"
import moment from "moment"
import Page from "@/components/common/Page/Page"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import Card from "@/components/common/Card/Card"
import useActions from "@/hooks/useActions"
import CardItem from "@/components/common/CardItem/CardItem"

interface Props {
  user: UserInterface,
  error?: {
    error: number,
    message: string
  }
}

const CustomerDetailsAdminPage = ({ user, error }: Props) => {

  if (error) {
    return <Page>{error.message}</Page>
  }

  const [editing, setEditing] = useState(false)

  const { replace, back, pathname } = useRouter()

  const { canEdit } = useActions()

  const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
    defaultValues: {
      "name": user.name,
      "email": user.email,
      "active": user.active,
    }
  });

  const [saving, setSaving] = useState(false)

  const onSubmit = async (values: any) => {
    //setSaving(true)

    try {
      const update = {
        name: values.name,
        "email": values.email,
        "active": values.active,
      }
      await makeRequest('put', `/api/users/${user._id}`, update)
      toast.success('Usuario actualizado')
      setSaving(false)
      setEditing(false)
      replace(`/admin/customers/${user._id}`)
    } catch (error: any) {
      toast.error(error.response.data.message)
      setSaving(false)
    }
  }

  const renderForm = () => {
    return (
      <>
        <Input
          register={register}
          label='Nombre'
          name='name'
          errors={errors}
          required
        />
        <Input
          type='email'
          register={register}
          label='Correo electrónico'
          name='email'
          errors={errors}
          required
        />
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
        title={`Detalle de cliente: ${user.name}`}
        fullWidth={false}
        maxwidth="700px"
        primaryAction={{
          name: "Editar",
          onClick: () => {
            setEditing(true)
          }
        }}
      >
        <>
          <Card>
            <>
              <CardItem
                title="Nombre"
                content={<span>{user.name}</span>}
              />
              <CardItem
                title="Correo electrónico"
                content={<span>{user.email}</span>}
              />
              {
                canEdit &&
                <CardItem
                  title="Contraseña"
                  content={
                    <button
                      disabled={saving}
                      onClick={async () => {
                        try {
                          setSaving(true)
                          await makeRequest('post', '/api/auth/recover', {
                            email: user.email
                          })
                          toast.success('Se envió un correo con las instrucciones para restablecer la contraseña', {
                            duration: 6000
                          })
                          setSaving(false)
                        } catch (error: any) {
                          toast.error(error.response.data.message, {
                            duration: 6000
                          })
                          setSaving(false)
                        }
                      }}
                      className="btn btn-black mt-10">Restablecer contraseña</button>
                  }
                />
              }
              {/* <CardItem>
                <h4>Pedidos</h4>
                <span>{user.orders}</span>
              </CardItem> */}
              <CardItem
                title="Fecha de registro"
                content={<span>{moment(user.createdAt).format('lll')}</span>}
              />
              {
                user.lastLogin &&
                <CardItem
                  title="Ultimo acceso"
                  content={<span>{moment(user.lastLogin).format('lll')}</span>}
                />
              }
              <CardItem
                title="Estado"
                content={<>
                  {
                    user.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
                  }
                  {
                    user.verified ? <Chip text='Verificado' color='green' /> : <Chip text='No verificado' />
                  }
                </>}
              />
            </>
          </Card>
        </>
      </Page >
      <Modal
        visible={editing}
        loadingState={saving /* || uploading */}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar usuario'
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
    endpoint: '/api/admin/users/:id',
    dataKey: 'user',
    propKey: 'user'
  })
}

CustomerDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Clientes | ${page.props.user?.name}`}>
      {page}
    </Layout>
  );
};

export default CustomerDetailsAdminPage