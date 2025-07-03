import Layout from "@/components/admin/Layout"
import Checkbox from "@/components/common/Checkbox/Checkbox"
import Input from "@/components/common/Input/Input"
import Modal from "@/components/common/Modal/Modal"
import Select from "@/components/common/Select/Select"
import { UserInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Chip from "@/components/common/Chip/Chip"
import styles from '@/styles/admin/Users.module.scss'
import moment from "moment"
import { views } from "@/utils/views"
import { pageResourceMap, pageTitleMap, permissionLabelMap, userRolesMap } from "@/utils/mappings"
import Page from "@/components/common/Page/Page"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import Card from "@/components/common/Card/Card"
import useActions from "@/hooks/useActions"
import CardItem from "@/components/common/CardItem/CardItem"
import { UserRole } from "@/utils/types"
import { userRoles } from "@/utils/catalogs"
import build from "next/dist/build"
import { buildUserPermissions } from "@/utils/buildUserPermissions"

interface Props {
  user: UserInterface,
  error?: {
    error: number,
    message: string
  }
}

function transformResponseToDefaultValues(dbResponse: any[]) {
  return dbResponse.reduce((acc, item) => {
    acc[item.page] = item.permissions;
    return acc;
  }, {});
}

const UserDetailsAdminPage = ({ user, error }: Props) => {

  if (error) {
    return <Page>{error.message}</Page>
  }

  const [editing, setEditing] = useState(false)

  const { replace, back, pathname } = useRouter()

  const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
    defaultValues: {
      "role": {
        label: userRolesMap[user.role],
        value: user.role
      },
      "name": user.name,
      "email": user.email,
      "active": user.active,
      permissions: transformResponseToDefaultValues(user.permissions)
    }
  });

  const [saving, setSaving] = useState(false)

  const [role, setRole] = useState<UserRole | undefined>(user.role)

  const onSubmit = async (values: any) => {

    const permissions = buildUserPermissions(values.permissions, values.role.value)

    try {
      const update = {
        name: values.name,
        "role": values.role.value,
        "email": values.email,
        "active": values.active,
        permissions
      }

      await makeRequest('put', `/api/admin/users/${user._id}`, update)
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
        <Select
          control={control}
          errors={errors}
          required
          options={userRoles}
          name="role"
          label="Tipo de usuario"
          onChange={(e: any) => {
            setRole(e.value)
          }}
        />
        {
          (role && role !== 'delivery' && role !== 'admin') &&
          <div className={styles.rolesWrapper}>
            <span>Elegir permisos de usuario</span>
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
                        label='Crear'
                        id={`permissions[${role.view}]-create`}
                        value='create'
                      />
                    </div>
                    <div className={styles.role}>
                      <Checkbox
                        register={register}
                        name={`permissions[${role.view}]`}
                        label='Editar'
                        id={`permissions[${role.view}]-edit`}
                        value='edit'
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

  const { canEdit } = useActions()

  return (
    <>
      <Page
        title={`Detalle de usuario: ${user.name}`}
        fullWidth={false}
        maxwidth="700px"
        primaryAction={{
          name: "Editar",
          onClick: () => {
            setEditing(true)
          }
        }}
      >
        <Card>
          <CardItem
            title="Tipo de usuario"
            content={<span>{userRolesMap[user.role]}</span>}
          />
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
          {
            user.permissions && user.permissions.length > 0 &&
            <CardItem
              title="Permisos"
              content={
                user.permissions.map(page => (
                  <div className="mb-20" key={page.page}>
                    <b >
                      {/* @ts-ignore */}
                      {pageTitleMap[page.page]}
                    </b>
                    {
                      page.permissions?.map(perm => (
                        //@ts-ignore
                        <span key={perm}>{permissionLabelMap[perm]}</span>
                      ))
                    }
                  </div>
                )
                )
              }
            />
          }
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
        </Card>
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
    endpoint: "/api/admin/users/:id",
    dataKey: "user",
    propKey: "user",
  });
}

UserDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Usuarios | ${page.props.user?.name}`}>
      {page}
    </Layout>
  );
};

export default UserDetailsAdminPage