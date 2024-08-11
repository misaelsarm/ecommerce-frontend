import { api } from "@/api_config/api"
import Layout from "@/components/admin/Layout"
import { Sortable } from "@/components/admin/Sortable"
import Checkbox from "@/components/common/Checkbox"
import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import TextArea from "@/components/common/TextArea"
import { ProductInterface } from "@/interfaces"
import { numberWithCommas } from "@/utils/numberWithCommas"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"


interface Props {
  product: ProductInterface
}

const ProductDetailsAdminPage = ({ product }: Props) => {

  const [editing, setEditing] = useState(false)

  console.log({ product })

  const { register, handleSubmit, control, resetField, formState: { errors }, reset } = useForm<any>({
    defaultValues: {
      name: product.name,
      description: product.description,
      keywords: product.keywords,
      price: product.price,
      collections: product.collections,
      isCustomizable: product.isCustomizable,
      attributes: product.attributes.map(att => (
        {
          label: att.shortName,
          value: att.id
        }
      ))
    }
  });

  const [saving, setSaving] = useState(false)

  const [hasDiscount, setHasDiscount] = useState(false)

  const [isCustomizable, setIsCustomizable] = useState(product.isCustomizable)

  const [isTracked, setIsTracked] = useState(false)

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

  useEffect(() => {
    // setCrop(product.crop)
    // setImages(product.images)
    // setHasDiscount(product.hasDiscount)
    // setIsCustomizable(product.isCustomizable)
    // setImage(product.previewImage)
    // reset({
    //   ...product,
    //   subCategories: product.subCategories.map((sub: any) => ({
    //     label: sub.name,
    //     value: sub._id
    //   }))
    // })
  }, [])

  const onSubmit = async (values: any) => {

    if (images.length === 0) return toast.error('Elige al menos 1 imagen')
    setSaving(true)
    try {
      const update = {
        ...values,
        attributes: values.attributes?.map((attribute: any) => attribute.value),
        subCategories: values.subCategories?.map((sub: any) => sub.value),
        images,
      }
      //await makeRequest('put', `/api/products/${product.id}`, update)
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
          options={[]}
          name="collections"
          label="Colecciones"
          isMulti
        />
        <Checkbox
          label='Tiene descuento'
          id='hasDiscount'
          onChange={(e) => {
            setHasDiscount(e.target.checked)
          }}
          name='hasDiscount'
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
          label='Activo'
          id='active'
          name='active'
          defaultChecked={product.active}
        />
        <Checkbox
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
            options={[]}
            name="attributes"
            label="Atributos y características del producto"
            isMulti
          />
        }
        <Checkbox
          label='Realizar seguimiento de inventario'
          id='isTracked'
          name='isTracked'
          onChange={(e) => {
            setIsTracked(e.target.checked)
          }}
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
                //const { data: subCategoriesData } = await api.get('/api/subcategories')
                //setSubCategories(subCategoriesData.subcategories)
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
                product.attributes && product.attributes.length > 0 &&
                <div className="cardItem">
                  <h4>Atributos</h4>
                  {
                    product.attributes.map(attribute => (
                      <span key={attribute.id}>{attribute.shortName}</span>
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
                <h4>Agotado</h4>
                <span>{product.soldOut ? 'Si' : 'No'}</span>
              </div>
              <div className="cardItem">
                <h4>Tiene descuento</h4>
                <span>{product.discount?.hasDiscount ? 'Si' : 'No'}</span>
              </div>
              <div className="cardItem">
                <h4>Valor del descuento</h4>
                <span>{product.discount?.discountValue}</span>
              </div>
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