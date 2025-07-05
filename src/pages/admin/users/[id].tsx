import Layout from "@/components/admin/Layout"
import { UserInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { GetServerSideProps } from "next"
import { ReactElement, useState } from "react"
import toast from "react-hot-toast"
import moment from "moment"
import { pageTitleMap, permissionLabelMap, userRolesMap } from "@/utils/mappings"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import useActions from "@/hooks/useActions"
import { Button, Card, CardItem, Chip, Page } from "@/components/common"
import { UserModal } from "@/components/admin/users/UserModal"

interface Props {
  user: UserInterface,
  error?: {
    error: number,
    message: string
  }
}

const UserDetailsAdminPage = ({ user, error }: Props) => {

  const [editing, setEditing] = useState(false)

  const [saving, setSaving] = useState(false)

  const { canEdit } = useActions()

  const requestPasswordReset = async () => {
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
  }

  if (error) {
    return <Page>{error.message}</Page>
  }

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
        backAction
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
                <Button
                  disabled={saving}
                  onClick={requestPasswordReset}
                >
                  Restablecer contraseña
                </Button>
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
      </Page>
      <UserModal
        title="Editar usuario"
        user={user}
        setVisible={setEditing}
        visible={editing}
      />
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