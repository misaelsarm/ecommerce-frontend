import { ReactElement, useState } from "react"
import { GetServerSideProps } from "next"
import { CollectionInterface } from "@/interfaces"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import Layout from "@/components/admin/Layout"
import { Card, CardItem, Chip, Page } from "@/components/common"
import { CollectionModal } from "@/components/admin/collections/CollectionModal"

interface Props {
  collection: CollectionInterface,
  error: {
    error: number,
    message: string
  }
}

const CollectionDetailsPage = ({ collection, error }: Props) => {

  const [editing, setEditing] = useState(false)

  if (error) {
    return <Page>{error.message}</Page>
  }

  return (
    <>
      <Page
        title={`Colección: ${collection.name}`}
        primaryAction={{
          name: 'Editar',
          onClick: () => {
            setEditing(true)
          }
        }}
        fullWidth={false}
        maxwidth="700px"
        backAction
      >
        <Card>
          <CardItem
            title="Nombre"
            content={<span>{collection.name}</span>}
          />
          <CardItem
            title="Código"
            content={<span>{collection.code}</span>}
          />
          <CardItem
            title="Descripción"
            content={<span style={{ whiteSpace: 'pre-line' }}>{collection.description}</span>}
          />
          {
            collection.parentCollection &&
            <CardItem
              title="Colección agrupadora"
              content={<Chip text={collection.parentCollection?.name} />}
            />
          }
          <CardItem
            title="Palabras clave"
            content={<span>{collection.keywords}</span>}
          />
          <CardItem
            title="Estado"
            content={collection.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />}
          />
          <CardItem
            title="Imagen principal"
            content={<div className="image">
              <img alt={collection.name} fill src={collection.image} />
            </div>}
          />
        </Card>
      </Page >
      <CollectionModal
        visible={editing}
        setVisible={setEditing}
        collection={collection}
        title="Editar colección"
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  return createServerSideFetcher(context, {
    endpoint: "/api/public/collections/:code",
    dataKey: "collection",
    propKey: "collection",
    paramKey: "code"
  });
}

CollectionDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Colecciones | ${page.props.collection?.name}`}>
      {page}
    </Layout>
  );
};

export default CollectionDetailsPage