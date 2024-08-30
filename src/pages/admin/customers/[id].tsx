import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import Checkbox from "@/components/common/Checkbox"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import { AttributeInterface, CollectionInterface, UserInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import Chip from "@/components/common/Chip"
import styles from '@/styles/admin/Users.module.scss'
import { getServerSideToken } from "@/utils/getServerSideToken"
import moment from "moment"


interface Props {
  user: UserInterface
}

const CustomerDetailsAdminPage = ({ user }: Props) => {

  console.log({ user })

  const [editing, setEditing] = useState(false)

  const [collections, setCollections] = useState([])

  const [attributes, setAttributes] = useState([])

  async function fetchData() {
    try {

      const { data } = await api.get(`/api/collections`, {
        headers: {
          //"x-access-token": token
          //"x-location": "admin"
        }
      })
      const { data: attributesData } = await api.get(`/api/attributes`, {
        headers: {
          "x-access-token": Cookies.get('token')
          //"x-location": "admin"
        }
      })
      setCollections(data.collections.map((col: CollectionInterface) => ({
        label: col.name,
        value: col._id
      })))
      setAttributes(attributesData.attributes.map((att: AttributeInterface) => ({
        label: att.shortName,
        value: att._id
      })))
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

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
      "permissions": user.permissions,
    }
  });

  const [saving, setSaving] = useState(false)

  const { replace, back } = useRouter()

  //const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const data = await handleFileUpload(file);
    //   setImage(data as string)
    // }
  };

  const onSubmit = async (values: any) => {

    console.log({ values })
    //setSaving(true)

    try {
      const update = {
        name: values.name,
        "role": values.role,
        "email": values.email,
        "active": values.active,
       // "permissions": values.permissions,
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
              !editing && <button className='btn btn-black' onClick={async () => {
                setEditing(true)
                await fetchData()
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
              <div className="cardItem">
                <h4>Contraseña</h4>
                <button
                  disabled={saving}
                  onClick={async () => {
                    try {
                      setSaving(true)
                      await makeRequest('post', '/api/auth/recover', {
                        email: "misael@wearerethink.mx"
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
                  user.active ? <Chip text='activo' color='green' /> : <Chip text='no activo' />
                }
                {
                  user.verified ? <Chip text='verificado' color='green' /> : <Chip text='no verificado' />
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
    const { data } = await api.get(`/api/users/${id}`, {
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