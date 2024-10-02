import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import Checkbox from "@/components/common/Checkbox"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import { UserInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Chip from "@/components/common/Chip"
import styles from '@/styles/admin/Users.module.scss'
import { getServerSideToken } from "@/utils/getServerSideToken"
import moment from "moment"
import { permissionsMap } from "@/utils/permissionsMap"
import { pagesMap } from "@/utils/pagesMap"
import { hasPermission } from "@/utils/hasPermission"
import { AuthContext } from "@/context/auth/AuthContext"

interface Props {
  user: UserInterface
}

function transformResponseToDefaultValues(dbResponse) {
  return dbResponse.reduce((acc, item) => {
    acc[item.page] = item.permissions;
    return acc;
  }, {});
}

const UserDetailsAdminPage = ({ user }: Props) => {

  const [editing, setEditing] = useState(false)

  const { replace, back, pathname } = useRouter()

  const { user: currentUser } = useContext(AuthContext)

  const canCreateEdit = currentUser.role?.value === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

  const views = [
    {
      view: '/admin/orders',
      name: 'Pedidos',
    },
    {
      view: '/admin/products',
      name: 'Productos',
    },
    {
      view: '/admin/attributes',
      name: 'Atributos de producto',
    },
    {
      view: '/admin/values',
      name: 'Valores de atributo',
    },
    {
      view: '/admin/collections',
      name: 'Colecciones',
    },
    {
      view: '/admin/customers',
      name: 'Clientes',
    },
    {
      view: '/admin/users',
      name: 'Usuarios',
    },
    {
      view: '/admin/discounts',
      name: 'Descuentos',
    },
    {
      view: '/admin/reportes/rutas',
      name: 'Reporte de rutas',
    },
    {
      view: '/admin/reportes/repartidores',
      name: 'Reporte de repartidores',
    },
    {
      view: '/admin/reportes/ventas',
      name: 'Reporte de ventas',
    },
    {
      view: '/admin/general',
      name: 'General',
    },
  ]

  const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
    defaultValues: {
      "role": user.role,
      "name": user.name,
      "email": user.email,
      "active": user.active,
      permissions: transformResponseToDefaultValues(user.permissions)
    }
  });

  const [saving, setSaving] = useState(false)

  const onSubmit = async (values: any) => {

    const permissions = values.permissions

    let mapped: any[] = []

    if (permissions) {
      mapped = Object.keys(permissions).map(role => ({
        page: role,
        permissions: permissions[role] || [],
      }))
    }

    const access = [...mapped]
    try {
      const update = {
        name: values.name,
        "role": values.role,
        "email": values.email,
        "active": values.active,
        permissions: access.filter(role => role.permissions.length > 0),
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
        {/* <Input
          type='password'
          register={register}
          label='Contraseña'
          name='password'
          errors={errors}
          required
        /> */}
        <Select
          control={control}
          errors={errors}
          required
          options={[
            {
              label: 'Administrador',
              value: 'admin'
            },
            {
              label: 'Usuario',
              value: 'user'
            },
            {
              label: 'Repartidor',
              value: 'delivery'
            },
          ]}
          name="role"
          label="Tipo de acceso"
        />
        <div className={styles.rolesWrapper}>
          <span>Elegir accesos de usuario</span>
          {
            views.map(role => (
              <div key={role.view} className={styles.viewWrapper}>
                <div className={styles.view}>
                  <h4>{role.name}</h4>
                </div>
                <div className={styles.roles}>
                  <div className={styles.role}>
                    <Checkbox
                      register={register}
                      name={`permissions[${role.view}]`}
                      label='Ver'
                      id={`permissions[${role.view}]-view`}
                      value='view'
                    />
                  </div>
                  <div className={styles.role}>
                    <Checkbox
                      register={register}
                      name={`permissions[${role.view}]`}
                      label='Crear / Editar'
                      id={`permissions[${role.view}]-create-edit`}
                      value='create-edit'
                    />
                  </div>
                  <div className={styles.role}>
                    <Checkbox
                      register={register}
                      name={`permissions[${role.view}]`}
                      label='Eliminar'
                      id={`permissions[${role.view}]-delete`}
                      value='delete'
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
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
                //await fetchData()
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
              {
                user.permissions && user.permissions.length > 0 &&
                <div className="cardItem">
                  <h4>Accesos</h4>
                  {
                    user.permissions.map(page => (
                      <div className="mb-20" key={page.page}>
                        <b >
                          {pagesMap[page.page]}
                        </b>
                        {
                          page.permissions?.map(perm => (
                            <span key={perm}>{permissionsMap[perm]}</span>
                          ))
                        }
                      </div>
                    )

                    )
                  }
                </div>
              }
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

UserDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="UserDetailsAdminPage">
      {page}
    </Layout>
  );
};

export default UserDetailsAdminPage