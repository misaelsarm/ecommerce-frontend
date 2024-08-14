import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import { Sortable } from "@/components/admin/Sortable"
import Checkbox from "@/components/common/Checkbox"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import TextArea from "@/components/common/TextArea"
import { AttributeInterface, CollectionInterface, ProductInterface } from "@/interfaces"
import { makeRequest } from "@/utils/makeRequest"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Cookies from "js-cookie"

interface Props {
  product: ProductInterface
}

const ProductDetailsAdminPage = ({ product }: Props) => {

  console.log({ product })

  const [editing, setEditing] = useState(false)

  const [collections, setCollections] = useState([])

  const [attributes, setAttributes] = useState([])

  console.log({ collections, attributes })

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

  const { register, handleSubmit, control, resetField, formState: { errors }, reset } = useForm<any>({
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

  const { replace, back } = useRouter()

  const [uploading, setUploading] = useState(false)

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

    //if (images.length === 0) return toast.error('Elige al menos 1 imagen')

    //setSaving(true)

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
      replace(`/admin/products/${values.name.trim().toLowerCase().split(' ').join('-')}`)
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
                <h4>Nombre</h4>
                <span>{product.name}</span>
              </div>
              <div className="cardItem">
                <h4>Código</h4>
                <span>{product.code}</span>
              </div>
              <div style={{
                whiteSpace: 'pre-line'
              }} className="cardItem">
                <h4>Descripcion</h4>
                <span>{product.description}</span>
              </div>
              <div className="cardItem">
                <h4>Palabras clave</h4>
                <span>{product.keywords}</span>
              </div>
              <div className="cardItem">
                <h4>Precio</h4>
                <span>${numberWithCommas(product.price.toFixed(2))} </span>
              </div>
              <div className="cardItem">
                <h4>Es personalizable</h4>
                <span>{product.isCustomizable ? 'Si' : 'No'}</span>
              </div>
              {
                product.isCustomizable &&
                <div className="cardItem">
                  <h4>Atributos</h4>
                  {
                    product.attributes.map(attribute => (
                      <span key={attribute._id}>{attribute.shortName}</span>
                    ))
                  }
                </div>
              }
              <div className="cardItem">
                <h4>Agotado</h4>
                <span>{product.soldOut ? 'Si' : 'No'}</span>
              </div>
              <div className="cardItem">
                <h4>Activo</h4>
                <span>{product.active ? 'Si' : 'No'}</span>
              </div>
              <div className="cardItem">
                <h4>Tiene descuento</h4>
                <span>{product.discount?.hasDiscount ? 'Si' : 'No'}</span>
              </div>
              {
                product.discount?.hasDiscount &&
                <div className="cardItem">
                  <h4>Valor del descuento</h4>
                  <span>{product.discount?.discountValue}</span>
                </div>
              }
              {
                product.inventory.isTracked &&
                <div className="cardItem">
                  <h4>Inventario disponible</h4>
                  <span>{product.inventory.availableQuantity}</span>
                </div>
              }
              <div className="cardItem">
                <h4>Imagenes</h4>
                <div className='flex wrap'>
                  {
                    product.images.map(image => (
                      <div key={image} className='mr-20 mb-20'>
                        <img style={{ width: 150, flexShrink: 0 }} src={image} alt="" />
                      </div>
                    ))
                  }
                </div>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const code = params?.code

  let product

  try {
    const { data } = await api.get(`/api/products/${code}`)
    product = data.product
  } catch (error) {

  }

  return {
    props: {

      product
    }
  }
}

ProductDetailsAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="ProductDetailsAdminPage">
      {page}
    </Layout>
  );
};

export default ProductDetailsAdminPage