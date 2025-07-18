import Layout from "@/components/admin/Layout"
import { ValueInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { ReactElement, useState } from "react"
import { valueTypesMap } from "@/utils/mappings"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import { Card, CardItem, Chip, Page } from "@/components/common"
import { ValueModal } from "@/components/admin/values/ValueModal"
import { usePermissions } from "@/hooks/usePermissions"

interface Props {
  value: ValueInterface
  error: {
    message: string
    error: number
  }
}

const ValueDetailsAdminPage = ({ value, error }: Props) => {

  const [editing, setEditing] = useState(false)

  const { canEdit } = usePermissions();

  if (error) {
    return <Page>{error.message}</Page>
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
          visible: canEdit
        }}
        backAction
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
      <ValueModal
        title="Actualizar valor"
        visible={editing}
        setVisible={setEditing}
        value={value}
      />
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