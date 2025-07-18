import Layout from "@/components/admin/Layout"
import { ProductInterface } from "@/interfaces"
import { GetServerSideProps } from "next"
import { ReactElement, useState } from "react"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import { Card, CardItem, Chip, Page } from "@/components/common"
import { ProductModal } from "@/components/admin/products/ProductModal"
import { productFieldMap } from "@/utils/mappings"
import moment from "moment"
import { usePermissions } from "@/hooks/usePermissions"

interface Props {
  product: ProductInterface
  error?: {
    message: string
    error: number
  }
}

const ProductDetailsAdminPage = ({ product, error }: Props) => {

  const [editing, setEditing] = useState(false)

  const { canEdit } = usePermissions();

  if (error) {
    return <Page>{error.message}</Page>
  }

  const propertiesToFilter = ['_id', 'deleted', '__v', 'favorite', 'collectionItem', 'whatsapp', 'hasDiscount', 'discountValue']

  const properties = Object.entries(product).filter(([key, value]) => !propertiesToFilter.includes(key))

  const renderComponent = (key: string, value: any) => {

    const property = productFieldMap[key]

    const { type, label, render } = property

    if (type === 'text') {
      return (
        <CardItem
          title={label}
          content={
            <span
              style={{ whiteSpace: 'pre-line' }}
            >
              {value}
            </span>
          }
        />
      )
    }
    if (type === 'date') {
      return (
        <CardItem
          title={label}
          content={moment(value).format('lll')}
        />
      )
    }
    if (type === 'boolean') {
      return (
        <CardItem
          title={label}
          content={value ? <Chip text={property.true} color='green' /> : <Chip text={property.false} />}
        />
      )
    }
    if (type === 'list' && render === 'grid') {
      return (
        <CardItem
          title={label}
          content={
            <div className='d-flex flex-wrap'>
              {
                product.images.map(image => (
                  <div key={image} className='mr-20 mb-20'>
                    <img style={{ width: 150, flexShrink: 0 }} src={image} alt="" />
                  </div>
                ))
              }
            </div>
          }
        />
      )
    }
    if (type === 'list') {
      return (
        <CardItem
          title={label}
          content={
            value.map((item: any) => (
              <Chip text={item[property.fields[1]]} />
            ))
          }
        />
      )
    }
    return (
      <CardItem
        title={label || key}
        content={<span>{JSON.stringify(value)}</span>}
      />
    )
  }

  return (
    <>
      <Page
        title={product.name}
        primaryAction={{
          name: "Editar",
          onClick: () => {
            setEditing(true)
          },
          visible: canEdit
        }}
        backAction
        fullWidth={false}
        maxwidth="700px"
      >
        <>
          <Card>
            {/* <CardItem
              title='Nombre'
              content={<span>{product.name}</span>}
            />
            <CardItem
              title="Código"
              content={<span>{product.code}</span>}
            />
            <CardItem
              title="Descripción"
              content={<span style={{ whiteSpace: 'pre-line' }}>{product.description}</span>}
            />
            <CardItem
              title="Colecciones"
              content={<div>{
                product.collections.map(col => (
                  <Chip key={col._id} text={col.name} />
                ))
              }
              </div>}
            />
            <CardItem
              title="Palabras clave"
              content={<span>{product.keywords}</span>}
            />
            <CardItem
              title="Precio"
              content={<span>{formatCurrency(product.price)} </span>
              }
            />
            <CardItem
              title="Es personalizable"
              content={<span>{product.isCustomizable ? 'Si' : 'No'}</span>}
            />
            {
              product.isCustomizable &&
              <CardItem
                title="Atributos"
                content={product.attributes.map(attribute => (
                  <Chip text={attribute.shortName} key={attribute._id} />
                ))}
              />
            }
            <CardItem
              title="Agotado"
              content={<span>{product.soldOut ? 'Si' : 'No'}</span>}
            />
            <CardItem
              title="Estado"
              content={product.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />}
            />
            <CardItem
              title="Tiene descuento"
              content={<span>{product.discount?.hasDiscount ? 'Si' : 'No'}</span>}
            />
            {
              product.discount?.hasDiscount &&
              <CardItem
                title="Valor del descuento"
                content={<span>{product.discount?.discountValue}</span>}
              />
            }
            {
              product.inventory?.isTracked &&
              <CardItem
                title="Inventario disponible"
                content={<span>{product.inventory.availableQuantity}</span>}
              />
            }
            <CardItem
              title="Imagenes"
              content={
                <div className='flex wrap'>
                  {
                    product.images.map(image => (
                      <div key={image} className='mr-20 mb-20'>
                        <img style={{ width: 150, flexShrink: 0 }} src={image} alt="" />
                      </div>
                    ))
                  }
                </div>
              }
            /> */}
            {
              properties.map(([key, value]) => renderComponent(key, value))
            }
          </Card>
        </>
      </Page>
      <ProductModal
        visible={editing}
        setVisible={setEditing}
        title="Editar producto"
        product={product}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  return createServerSideFetcher(context, {
    endpoint: '/api/public/products/:code',
    dataKey: 'product',
    propKey: 'product',
    paramKey: 'code',
  })

}

ProductDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title={`Productos | ${page.props.product?.name}`}>
      {page}
    </Layout>
  );
};

export default ProductDetailsAdminPage