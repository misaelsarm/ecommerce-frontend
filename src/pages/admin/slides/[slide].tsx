import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import useFileUpload from '@/hooks/useFileUpload'
import { Category, Product, Slide } from '@/interfaces'
import { SubCategory } from '@/interfaces/SubCategory'
import { makeRequest } from '@/utils/makeRequest'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'

interface Props {
  slide: Slide
}

const SlideDetailsPage = ({ slide }: Props) => {

  const [editing, setEditing] = useState(false)
  const webRef = useRef<any>()
  const mobileRef = useRef<any>()
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
  const [type, setType] = useState(slide.type?.value)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])

  const [images, setImages] = useState(slide.images)

  const { back, replace } = useRouter()

  const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'web' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await handleFileUpload(file) as string

      if (type === 'web') {
        setImages({
          web: data,
          mobile: images.mobile
        })
      } else {
        setImages({
          mobile: data,
          web: images.web
        })
      }

    }
  };

  const renderForm = () => {
    return (
      <div className='form__container'>
        <div className='group'>
          <label htmlFor="">Subir imagen de slide (Escritorio)</label>
          <input
            onChange={(e) => onFileChange(e, 'web')}
            ref={webRef}
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
          />
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
            {
              images.web !== '' &&
              <div
                className='imagePreview'>
                <button onClick={() => webRef.current.click()} className='btn delete'>Elegir otra imagen</button>
                <img src={images.web} alt='' />

              </div>
            }
            {
              images.web === '' &&
              <div onClick={() => { webRef.current.click() }} style={
                {
                  width: '100%',
                  height: 150,
                  border: '2px dashed #cdcdcd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 14,
                  cursor: 'pointer',
                  marginLeft: images.web ? 20 : 0,
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
        <div className='group'>
          <label htmlFor="">Subir imagen de slide (Móvil)</label>
          <input
            onChange={(e) => onFileChange(e, 'mobile')}
            ref={mobileRef}
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
          />
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
            {
              images.mobile !== '' &&
              <div
                className='imagePreview'>
                <button onClick={() => mobileRef.current.click()} className='btn delete'>Elegir otra imagen</button>
                <img src={images.mobile} alt='' />

              </div>
            }
            {
              images.mobile === '' &&
              <div onClick={() => { mobileRef.current.click() }} style={
                {
                  width: 300,
                  height: 500,
                  border: '2px dashed #cdcdcd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 14,
                  cursor: 'pointer',
                  marginLeft: images.mobile ? 20 : 0,
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
        <div className="group">
          <Input
            type='number'
            register={register}
            placeholder='Posición (numero de slide)'
            name='position'
            errors={errors}
            label='Posición (numero de slide)'
          />
        </div>
        <div className="group">
          <input
            {...register('active')}
            type="checkbox"
            name="active"
            id="active"
            defaultChecked={slide.active}
          />
          <label htmlFor="active">Activa</label>
        </div>
        <div className="group">
          <span>Acción principal redirige hacia:</span>
          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, onBlur, value } }) =>
              <Select
                onChange={(e) => {
                  onChange(e)
                  setType(e.value)
                }}
                onBlur={onBlur}
                value={value}
                placeholder='Elegir'
                options={[
                  {
                    label: 'Una categoría',
                    value: 'category'
                  },
                  {
                    label: 'Una subcategoría',
                    value: 'subcategory'
                  },
                  {
                    label: 'Un producto',
                    value: 'product'
                  },
                ]}
              />}
          />
        </div>
        {
          type === 'product' &&
          <div className="group">
            <span>Elige producto a redirigir en accion principal:</span>
            <Controller
              name="product"
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                <Select
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Elegir'
                  options={products.map(item => (
                    {
                      label: item.name,
                      value: item.code
                    }
                  ))}
                />}
            />
          </div>
        }
        {
          type === 'category' &&
          <div className="group">
            <span>Elige categoría a redirigir en accion principal:</span>
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                <Select
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Elegir'
                  options={categories.map(item => (
                    {
                      label: item.name,
                      value: item.code
                    }
                  ))}
                />}
            />
          </div>
        }
        {
          type === 'subcategory' &&
          <div className="group">
            <span>Elige subcategoría a redirigir en accion principal:</span>
            <Controller
              name="subcategory"
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                <Select
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Elegir'
                  options={subcategories.map(item => (
                    {
                      label: item.name,
                      value: item.code
                    }
                  ))}
                />}
            />
          </div>
        }
      </div>
    )
  }

  const onSubmit = async (values: any) => {

    if (images.web === '') return toast.error('Elige una imagen para la slide (Web)')
    if (images.mobile === '') return toast.error('Elige una imagen para la slide (Movil)')
    setSaving(true)

    let url = ''

    if (values.type.value === 'product') {
      url = `/products/${values.product?.value}`
    }

    if (values.type.value === 'category') {
      url = `/categories/${values.category?.value}`
    }

    if (values.type.value === 'subcategory') {
      url = `/subcategories/${values.subcategory?.value}`
    }

    try {

      const update = {
        ...values,
        images,
        type: values.type,
        ctaRedirect: url,
        product: values.product,
        category: values.category,
        subcategory: values.subcategory
      }
      await makeRequest('put', `/api/slides/${slide.id}`, update)
      toast.success('Slide actualizada')
      setSaving(false)
      setEditing(false)
      replace(`/admin/slides/${slide.id}`)
    } catch (error: any) {
      toast.error(error.response.data.message)
      setSaving(false)
    }

  }

  useEffect(() => {

    reset({
      ...slide,
      type: {
        label: slide.type?.label,
        value: slide.type?.value
      }
    })

    const fetchData = async () => {
      try {
        const { data: categoriesData } = await api.get('/api/categories')
        const { data: productsData } = await api.get('/api/products')

        const { data: subcategoriesData } = await api.get('/api/subcategories')
        setSubcategories(subcategoriesData.subcategories)

        setCategories(categoriesData.categories)
        setProducts(productsData.products)

      } catch (error) {

      }
    }
    fetchData()
  }, [slide])

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
              !editing && <button className='btn btn-black' onClick={() => { setEditing(true) }}>Editar</button>
            }
            {
              editing &&
              <div className="flex">
                <button disabled={saving} onClick={() => { setEditing(false) }} className='btn btn-outlined mr-10'>Cancelar</button>
                <button disabled={saving || uploading} onClick={handleSubmit(onSubmit)} className='btn btn-black'>{saving ? 'Guardando...' : uploading ? 'Subiendo imagen...' : 'Guardar'}</button>
              </div>
            }
          </div>
          <div className="card">
            <div className="cardItem">
              <h4>Posición (Numero de slide)</h4>
              <span>{slide.position}</span>
            </div>
            <div className="cardItem">
              <h4>Redirige a </h4>
              <span>{slide.ctaRedirect}</span>
            </div>
            <div className="cardItem">
              <h4>Activa</h4>
              <span>{slide.active ? 'Si' : 'No'}</span>
            </div>
            <div className="cardItem">
              <h4>imagen Web</h4>
              <img style={{ width: '100%' }} src={slide.images.web} alt="" />
            </div>
            <div className="cardItem">
              <h4>imagen movil</h4>
              <img style={{ width: '100%' }} src={slide.images.mobile} alt="" />
            </div>

          </div>
        </>
      </div>
      <Modal
        visible={editing}
        loadingState={saving || uploading}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar slide'
        onClose={() => {
          setEditing(false)
        }}
      >
        {renderForm()}
      </Modal>
    </>
  )
}

SlideDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="SlideDetailsPage">
      {page}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req: nextReq }) => {

  const id = params?.slide

  const req = nextReq as any

  let slide

  try {
    const data = await makeRequest('get', `/api/slides/${id}`, {}, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    slide = data.slide
  } catch (error) {
    console.log({ error })
  }

  return {
    props: {
      slide
    }
  }
}

export default SlideDetailsPage