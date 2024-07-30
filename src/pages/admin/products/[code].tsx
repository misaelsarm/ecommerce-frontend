import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import { Upload } from '@/components/admin/Upload'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import TextArea from '@/components/ui/TextArea'
import useFileUpload from '@/hooks/useFileUpload'
import { Product } from '@/interfaces'
import { SubCategory } from '@/interfaces/SubCategory'
import { makeRequest } from '@/utils/makeRequest'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactCrop, { Crop } from 'react-image-crop'
import Select from 'react-select'

interface Props {
  product: Product
}

const ProductDetailsAdminPage = ({ product }: Props) => {

  const [editing, setEditing] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, control, resetField, formState: { errors }, reset } = useForm();
  const [hasDiscount, setHasDiscount] = useState(false);
  const subscribeToHasDiscount = register('hasDiscount')
  const subscribeToIsCustomizable = register('isCustomizable')
  const [isCustomizable, setIsCustomizable] = useState(false)
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const { replace, back } = useRouter()

  const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await handleFileUpload(file);
      setImage(data as string)
    }
  };

  const [crop, setCrop] = useState<Crop>()

  const [image, setImage] = useState('')

  const imageRef = useRef<any>()

  useEffect(() => {
    setCrop(product.crop)
    setImages(product.images)
    setHasDiscount(product.hasDiscount)
    setIsCustomizable(product.isCustomizable)
    setImage(product.previewImage)
    reset({
      ...product,
      subCategories: product.subCategories.map((sub: any) => ({
        label: sub.name,
        value: sub._id
      }))
    })
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
        crop,
        previewImage: image
      }
      await makeRequest('put', `/api/products/${product.id}`, update)
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
        <div className="group">
          <Input
            register={register}
            placeholder='Nombre'
            name='name'
            errors={errors}
            label='Nombre del producto'
            required
          />
        </div>
        <div className="group">
          <TextArea
            register={register}
            placeholder='Descripción'
            name='description'
            errors={errors}
            label='Descripción del producto'
            required
          />
        </div>
        <div className="group">
          <Input
            register={register}
            label='Palabras clave'
            placeholder=''
            name='keywords'
          />
        </div>
        <div className="group">
          <Input
            type='number'
            register={register}
            placeholder='Precio'
            name='price'
            errors={errors}
            label='Precio'
            required
          />
        </div>
        <div className="group">
          <span>Subcategorías</span>
          <Controller
            name="subCategories"
            control={control}
            render={({ field: { onChange, onBlur, value } }) =>
              <Select
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder='Subcategorías'
                isSearchable={true}
                isMulti
                options={subCategories.map(item => ({
                  value: item.id,
                  label: item.name
                }))}
              />}
          />
        </div>
        <div className="group">
          <input
            {...subscribeToHasDiscount}
            onChange={(e) => {
              setHasDiscount(e.target.checked)
            }}
            type="checkbox"
            name="hasDiscount"
            id="hasDiscount"
            defaultChecked={hasDiscount}
          />
          <label htmlFor="hasDiscount">Tiene descuento</label>
        </div>
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
        <div className="group">
          <input
            {...register('active')}
            type="checkbox"
            name="active"
            id="active"
            defaultChecked={product.active}
          />
          <label htmlFor="active">Activo</label>
        </div>
        <div className="group">
          <input
            {...register('soldOut')}
            type="checkbox"
            name="soldOut"
            id="soldOut"
            defaultChecked={product.soldOut}
          />
          <label htmlFor="soldOut">Agotado</label>
        </div>
        <div className="group">
          <input
            {...subscribeToIsCustomizable}
            onChange={(e) => {
              setIsCustomizable(e.target.checked)
              resetField('attributes')
            }}
            defaultChecked={isCustomizable}
            type="checkbox"
            name="isCustomizable"
            id="isCustomizable"
          />
          <label htmlFor="isCustomizable">Es personalizable</label>
        </div>
        <Upload
          url={`/api/files/multiple`}
          images={images}
          setImages={setImages}
        />
        <br />
        <br />
        <div className='group'>
          <label htmlFor="">Cargar imagen para vista previa</label>
          <input
            onChange={onFileChange}
            ref={imageRef}
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
          />
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
            {
              image !== '' &&
              <div
                className='imagePreview'>
                <button onClick={() => imageRef.current.click()} className='btn delete'>Elegir otra imagen</button>
                <ReactCrop
                  ruleOfThirds
                  maxWidth={550}
                  aspect={1} crop={crop} onChange={c => setCrop(c)}>
                  <div className='crop-wrapper'>
                    <img src={image} />
                    <span
                      style={{
                        //@ts-ignore
                        top: crop?.y
                      }}
                      className='guide'>Arriba</span>
                    <span
                      style={{
                        //@ts-ignore
                        top: crop?.y + ((crop?.height - 20) / 2)
                      }}
                      className='guide'>Enmedio</span>
                    <span
                      style={{
                        //@ts-ignore
                        top: crop?.y + crop?.height - 20
                      }}
                      className='guide'>Abajo</span>
                  </div>
                </ReactCrop>
              </div>
            }
            {
              image === '' &&
              <div onClick={() => { imageRef.current.click() }} style={
                {
                  width: 150,
                  height: 150,
                  border: '2px dashed #cdcdcd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 14,
                  cursor: 'pointer',
                  marginLeft: image ? 20 : 0,
                  flexShrink: 0
                }
              }>
                <span>
                  Elegir imagen
                </span>
              </div>
            }
          </div>
        </div>
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
                const { data: subCategoriesData } = await api.get('/api/subcategories')
                setSubCategories(subCategoriesData.subcategories)
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
              <div className="cardItem">
                <h4>Subcategorías</h4>
                {
                  product.subCategories.map(sub => (
                    <li key={sub.name}>{sub.name}</li>
                  ))
                }
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
                <span>${product.price} MXN</span>
              </div>
              <div className="cardItem">
                <h4>Es personalizable</h4>
                <span>{product.isCustomizable ? 'Si' : 'No'}</span>
              </div>
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
                <span>{product.hasDiscount ? 'Si' : 'No'}</span>
              </div>
              <div className="cardItem">
                <h4>Valor del descuento</h4>
                <span>{product.discountValue}</span>
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
        loadingState={saving || uploading}
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