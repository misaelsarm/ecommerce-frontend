import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import Checkbox from "@/components/common/Checkbox"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import { UserInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Chip from "@/components/common/Chip"
import { getServerSideToken } from "@/utils/getServerSideToken"
import moment from "moment"
import { hasPermission } from "@/utils/hasPermission"
import { AuthContext } from "@/context/auth/AuthContext"

interface Props {
  user: UserInterface
}

const CustomerDetailsAdminPage = ({ user }: Props) => {

  const [editing, setEditing] = useState(false)

  const { replace, back, pathname } = useRouter()

  const { user: currentUser } = useContext(AuthContext)

  const canCreateEdit = currentUser.role?.value === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

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
      replace(`/admin/users/${user._id}`)
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
              }}>Editar</button>
            }
          </div>
          <div className="card">
            <>
              <div className="cardItem">
                <h4>Tipo de usuario</h4>
                <span>{user.role.label}</span>
              </div>
              <div className="cardItem">
                <h4>Nombre</h4>
                <span>{user.name}</span>
              </div>
              <div className="cardItem">
                <h4>Correo electrónico</h4>
                <span>{user.email}</span>
              </div>
              {
                canCreateEdit &&
                <div className="cardItem">
                  <h4>Contraseña</h4>
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
                </div>
              }
              <div className="cardItem">
                <h4>Pedidos</h4>
                {/*    <span>{user.orders}</span> */}
              </div>
              <div className="cardItem">
                <h4>Ultimo acceso</h4>
                <span>{moment(user.lastLogin).format('lll')}</span>
              </div>
              <div className="cardItem">
                <h4>Estado</h4>
                {
                  user.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
                }
                {
                  user.verified ? <Chip text='Verificado' color='green' /> : <Chip text='No verificado' />
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

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {

  const id = params?.id

  let user

  const token = getServerSideToken(req)

  try {
    const data = await makeRequest('get', `/api/users/${id}`, {}, {
      headers:
      {
        "x-access-token": token
      }
    })
    user = data.user
  } catch (error) {

  }

  return {
    props: {
      user
    }
  }
}

CustomerDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="CustomerDetailsAdminPage">
      {page}
    </Layout>
  );
};

export default CustomerDetailsAdminPage