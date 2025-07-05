import Layout from "@/components/admin/Layout"
import { AttributeInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { ReactElement, useState } from "react"
import { attributeTypesMap } from "@/utils/mappings"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import { Card, CardItem, Chip, Page } from "@/components/common"
import { AttributeModal } from "@/components/admin/attributes/AttributeModal"
import { useRouter } from "next/router"

interface Props {
  attribute: AttributeInterface,
  error?: {
    message: string
    error: number
  }
}

const AttributeDetailsAdminPage = ({ attribute, error }: Props) => {

  const [editing, setEditing] = useState(false)

  const { replace } = useRouter()

  if (error) {
    return <Page>{error.message}</Page>
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
          }
        }}
        backAction
      >
        <>
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
              (attribute.type === 'short-text' || attribute.type === 'long-text') &&
              <CardItem
                title="Máximo de caracteres permitidos"
                content={<span>{attribute.max}</span>}
              />
            }
            {
              attribute.type === 'color' &&
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
      <AttributeModal
        visible={editing}
        setVisible={setEditing}
        title="Editar atributo"
        attribute={attribute}
        onOk={() => {
          setEditing(false)
          replace(`/admin/attributes/${attribute._id}`)
        }}
      />
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