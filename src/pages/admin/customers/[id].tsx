import Layout from "@/components/admin/Layout"
import { UserInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { GetServerSideProps } from "next"
import { ReactElement, useState } from "react"
import toast from "react-hot-toast"
import moment from "moment"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import {usePermissions} from "@/hooks/usePermissions"
import { Button, Card, CardItem, Chip, Page } from "@/components/common"
import { CustomerModal } from "@/components/admin/customers/CustomerModal"

interface Props {
  user: UserInterface,
  error?: {
    error: number,
    message: string
  }
}

const CustomerDetailsAdminPage = ({ user, error }: Props) => {

  const [editing, setEditing] = useState(false)

  const { canEdit } = usePermissions()

  const [saving, setSaving] = useState(false)

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

  return (
    <>
      <Page
        title={`Cliente: ${user.name}`}
        fullWidth={false}
        maxwidth="700px"
        primaryAction={{
          name: "Editar",
          onClick: () => {
            setEditing(true)
          },
          visible: canEdit
        }}
        backAction
      >
        <>
          <Card>
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

          </Card>
        </>
      </Page >
      <CustomerModal
        visible={editing}
        setVisible={setEditing}
        title="Editar cliente"
        user={user}
      />
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