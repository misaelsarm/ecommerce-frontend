import Layout from "@/components/admin/Layout"
import { Sortable } from "@/components/admin/Sortable"
import { AttributeInterface, CollectionInterface, ProductInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { formatCurrency } from "@/utils/formatCurrency"
import { createServerSideFetcher } from "@/utils/serverSideFetcher"
import { Checkbox, Input, Select, TextArea } from "@/components/common"

interface Props {
  product: ProductInterface
  error?: {
    message: string
    error: number
  }
}

const ProductDetailsAdminPage = ({ product, error }: Props) => {

  const [editing, setEditing] = useState(false)

  const [collections, setCollections] = useState([])

  const [attributes, setAttributes] = useState([])

  async function fetchData() {
    try {

      const data = await makeRequest('get', `/api/collections`)

      const attributesData = await makeRequest('get', `/api/attributes`)

      setCollections(data.collections.map((col: CollectionInterface) => ({
        label: col.name,
        value: col._id
      })))

      setAttributes(attributesData.attributes.map((att: AttributeInterface) => ({
        label: att.shortName,
        value: att._id
      })))

    } catch (error: any) {
      console.log({ error })
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
    defaultValues: {
      name: product.name,
      description: product.description,
      keywords: product.keywords,
      price: product.price,

      isCustomizable: product.isCustomizable,
      attributes: product.attributes.map(att => (
        {
          label: att.shortName,
          value: att._id
        }
      )),
      collections: product.collections.map(col => (
        {
          label: col.name,
          value: col._id
        }
      )),
      active: product.active,
      soldOut: product.soldOut,
      hasDiscount: product.discount?.hasDiscount,
      discountType: product.discount?.discountType,
      discountValue: product.discount?.discountValue,
      isTracked: product.inventory.isTracked,
      availableQuantity: product.inventory.availableQuantity
    }
  });

  const [saving, setSaving] = useState(false)

  const [hasDiscount, setHasDiscount] = useState(product.discount?.hasDiscount)

  const [isCustomizable, setIsCustomizable] = useState(product.isCustomizable)

  const [isTracked, setIsTracked] = useState(product.inventory.isTracked)

  const [images, setImages] = useState(product.images)

  const { replace } = useRouter()

  const [uploading, setUploading] = useState(false)

  const onSubmit = async (values: any) => {

    console.log({ values })

    //if (images.length === 0) return toast.error('Elige al menos 1 imagen')

    setSaving(true)

    try {
      const update = {
        attributes: values.attributes?.map((attribute: any) => attribute?.value),
        collections: values.collections?.map((col: any) => col.value),
        name: values.name,
        description: values.description,
        price: values.price,
        images,
        active: values.active,
        soldOut: values.soldOut,
        discount: {
          hasDiscount: values.hasDiscount,
          discountType: values.discountType,
          discountValue: values.discountValue
        },
        isCustomizable: values.isCustomizable,
        keywords: values.keywords,
        inventory: {
          isTracked: values.isTracked,
          availableQuantity: values.availableQuantity
        },
      }
      await makeRequest('put', `/api/products/${product._id}`, update)
      toast.success('Producto actualizado')
      setSaving(false)
      setEditing(false)
      const normalizeString = (str: string) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const code = normalizeString(values.name.trim().toLowerCase().split(' ').join('-'))
      replace(`/admin/products/${code}`)
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
          name='name'
          errors={errors}
          label='Nombre del producto'
          required
        />
        <TextArea
          register={register}
          name='description'
          errors={errors}
          label='Descripción del producto'
          required
        />
        <Input
          register={register}
          label='Palabras clave'
          name='keywords'
        />
        <Input
          type='number'
          register={register}
          name='price'
          errors={errors}
          label='Precio'
          required
        />
        <Select
          control={control}
          errors={errors}
          required
          options={collections}
          name="collections"
          label="Colecciones"
          isMulti
        />
        <Checkbox
          register={register}
          label='Tiene descuento'
          id='hasDiscount'
          onChange={(e) => {
            setHasDiscount(e.target.checked)
          }}
          name='hasDiscount'
          defaultChecked={product.discount?.hasDiscount}
        />
        {
          hasDiscount &&
          <div className="group">
            <Input
              required
              register={register}
              placeholder='Valor del descuento'
              name='discountValue'
              errors={errors}
              label='Valor del descuento'
            />
          </div>
        }
        <Checkbox
          register={register}
          label='Activo'
          id='active'
          name='active'
          defaultChecked={product.active}
        />
        <Checkbox
          register={register}
          label='Es personalizable'
          id='isCustomizable'
          name='isCustomizable'
          onChange={(e) => {
            setIsCustomizable(e.target.checked)
          }}
          defaultChecked={product.isCustomizable}
        />
        {
          isCustomizable && <Select
            control={control}
            errors={errors}
            required
            options={attributes}
            name="attributes"
            label="Atributos y características del producto"
            isMulti
          />
        }
        <Checkbox
          register={register}
          label='Realizar seguimiento de inventario'
          id='isTracked'
          name='isTracked'
          onChange={(e) => {
            setIsTracked(e.target.checked)
          }}
          defaultChecked={product.inventory.isTracked}
        />
        {
          isTracked &&
          <Input
            type='number'
            register={register}
            name='availableQuantity'
            errors={errors}
            label='Cantidad disponible'
            required
          />
        }
        <Sortable
          label='Agregar imagenes del producto'
          items={images}
          setItems={setImages}
          uploading={uploading}
          setUploading={setUploading}
          folder="products"
        />
      </>
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
            fetchData()
          }
          //className: 'btn btn-primary'
        }}
        backAction
        fullWidth={false}
        maxwidth="700px"
      >
        <>
          <Card>
            <CardItem
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
              content={<span>{product.active ? 'Activo' : 'No activo'}</span>}
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
              product.inventory.isTracked &&
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
            />
          </Card>
        </>
      </Page>
      <Modal
        visible={editing}
        loadingState={saving /* || uploading */}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar producto'
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