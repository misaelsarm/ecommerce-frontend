import { api } from '@/api_config/api';
import Layout from '@/components/admin/Layout'
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { Category, Discount, Product } from '@/interfaces';
import { SubCategory } from '@/interfaces/SubCategory';
import { makeRequest } from '@/utils/makeRequest';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
  discount: Discount
}

const DiscountDetailsPage = ({ discount }: Props) => {

  const [editing, setEditing] = useState(false)

  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();

  const limited = watch("limited")

  const [products, setProducts] = useState<Product[]>([])

  const [limitBy, setLimitBy] = useState('')

  const [discountType, setDiscountType] = useState('')

  const [categories, setCategories] = useState<Category[]>([])

  const { query: { id }, back, replace } = useRouter()

  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products?active=true')
      setProducts(data.products)
    } catch (error) {
      console.log({ error })
    }
  }
  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories?active=true')
      setCategories(data.categories)
    } catch (error) {
      console.log({ error })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {


        setStartDate(new Date(discount.expiry))
        setDiscountType(discount.type?.value)
        setLimitBy(discount.limitBy?.value)
        reset({
          ...discount,
          products: discount.products.map((product: any) => ({
            label: product.name,
            value: product._id
          })),
          categories: discount?.categories?.map((category: any) => ({
            label: category.name,
            value: category._id
          }))
        })
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [id, reset])

  const onSubmit = async (values: any) => {

    let validProducts = []

    let validCategories = []

    let foundProducts = []

    if (limitBy === 'category') {
      let selectedCategories = values.categories.map((cat: any) => cat.value)


      for (const product of products) {

        
      }

      validProducts = foundProducts
      validSubcategories = foundsubcats
      validCategories = selectedCategories

    } else if (limitBy === 'subcategory') {
      let selectedSubcategories = values.subcategories.map((cat: any) => cat.value)

      for (const product of products) {

        for (const subcat of product.subCategories) {
          if (selectedSubcategories.includes(subcat._id)) {
            foundProducts.push(product.id)
          }
        }
      }

      validProducts = foundProducts
      validSubcategories = selectedSubcategories

    } else {

      validProducts = values.products?.map((product: any) => product.value)
    }

    const discount = {
      ...values,
      products: validProducts,
      categories: validCategories,
      subcategories: validSubcategories
    }

    setSaving(true)
    try {
      await makeRequest('put', `/api/discounts/${id}`, discount);

      toast.success('Descuento actualizado')
      setSaving(false)
      setEditing(false)
      replace(`/admin/discounts/${id}`)
    } catch (error: any) {
      if (error) {
        toast.error(error.response.data.message)
        setSaving(false)
      }
    }
  }

  const renderForm = () => {
    return (
      <>
        <div className="group">
          <Input
            register={register}
            label='Nombre de descuento'
            name='name'
            errors={errors}
            required
          />
        </div>

        <div className="group">
          <Select
            required
            onChange={(e: any) => {
              console.log({ e })
              setDiscountType(e.value)
            }}
            options={[
              {
                label: 'Porcentaje',
                value: 'percentage'
              },
              {
                label: 'Monto fijo',
                value: 'fixed'
              },
            ]}
            errors={errors}
            control={control}
            name='type'
            label='Tipo de descuento'
          />
        </div>
        {
          discountType !== '' &&
          <>
            <div className="group">
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <Input
                  type='number'
                  register={register}
                  label='Valor del descuento'
                  placeholder=''
                  name='value'
                  errors={errors}
                  required
                />
                <span style={{
                  display: 'block',
                  marginLeft: 10,
                  fontSize: 20
                }}>{discountType === 'percentage' ? '%' : '$'}</span>
              </div>
            </div>
            <div className="group">
              <label>Fecha de expiración</label>
              <Controller
                rules={{
                  required: true,
                }}
                name='expiry'
                control={control}
                render={({ field: { onChange } }) =>
                  <ReactDatePicker
                    minDate={new Date()}
                    dateFormat='dd-MM-yyyy'
                    selected={startDate}
                    onChange={(date) => {
                      onChange(date)
                      setStartDate(date)
                    }}
                  />
                }
              />
              {
                errors.expiry && <span className="error">Requerido</span>
              }
            </div>
            <div className="group">
              <input {...register('active')} type="checkbox" name="active" id="active" />
              <label htmlFor="active">Activo</label>
            </div>
            <div className="group">
              <input {...register('limited')} type="checkbox" name="limited" id="limited" />
              <label htmlFor="limited">Limitar por categoría, subcategoría o producto</label>
            </div>
          </>
        }
        {
          limited &&
          <>
            <div className="group">
              <Select
                onChange={(e: any) => {
                  setLimitBy(e.value)
                }}
                required
                options={[
                  {
                    label: 'Categoría',
                    value: 'category'
                  },
                  {
                    label: 'Subcategoría',
                    value: 'subcategory'
                  },
                  {
                    label: 'Producto',
                    value: 'product'
                  },
                ]}
                errors={errors}
                control={control}
                name='limitBy'
                label='Limitar por'
              />
            </div>
            {
              limitBy === 'category' && <div className="group">
                <Select
                  required
                  options={categories.map(category => ({
                    label: category.name,
                    value: category.id
                  }))}
                  errors={errors}
                  control={control}
                  isMulti
                  name='categories'
                  label='Categorías que aplican'
                />
              </div>
            }
            {
              limitBy === 'subcategory' && <div className="group">
                <Select
                  required
                  options={subcategories.map(subcategory => ({
                    label: subcategory.name,
                    value: subcategory.id
                  }))}
                  errors={errors}
                  control={control}
                  isMulti
                  name='subcategories'
                  label='Subcategorías que aplican'
                />
              </div>
            }
            {
              limitBy === 'product' && <div className="group">
                <Select
                  required
                  options={products.map(product => ({
                    label: product.name,
                    value: product.id
                  }))}
                  errors={errors}
                  control={control}
                  isMulti
                  name='products'
                  label='Productos que aplican'
                />
              </div>
            }
            <div className="group">
              <input {...register('customOnly')} type="checkbox" name="customOnly" id="customOnly" />
              <label htmlFor="customOnly">Solo aplica si el producto es personalizado</label>
            </div>
          </>
        }
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
              !editing && <button className='btn btn-black' onClick={() => {
                setEditing(true)
                fetchProducts()
                fetchCategories()
                fetchSubcategories()
              }}>Editar</button>
            }
          </div>
          <div className="card">
            <div className="cardItem">
              <h4>Nombre</h4>
              <span>{discount.name}</span>
            </div>
            <div className="cardItem">
              <h4>Tipo</h4>
              <span>{discount.type.label}</span>
            </div>
            <div className="cardItem">
              <h4>Valor del descuento</h4>
              <span>{discount.type.value === 'percentage' ? `${discount.value}%` : `$ ${discount.value.toFixed(2)} MXN`}</span>
            </div>
            <div className="cardItem">
              <h4>Fecha de expiración</h4>
              <span>{moment(discount.expiry).format('ll')}</span>
            </div>
            <div className="cardItem">
              <h4>Activo</h4>
              <span>{discount.active ? 'Si' : 'No'}</span>
            </div>
            {
              discount.limited && <div className="cardItem">
                <h4>Elegibilidad</h4>
                {
                  discount.customOnly ? <span style={{ color: 'red' }}>Este descuento solo aplica para los siguientes productos y que hayan sido personalizados: </span> : <span>Este descuento solo aplica para los siguientes productos: </span>
                }
                <br />
                {
                  discount.products.map(product => (
                    <span key={product.name}>{product.name}</span>
                  ))
                }
              </div>
            }
          </div>
        </>

      </div >
      <Modal
        visible={editing}
        loadingState={saving}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar descuento'
        onClose={() => {
          setEditing(false)
        }}
      >
        {renderForm()}
      </Modal>
    </>
  )
}

DiscountDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Descuentos">
      {page}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, params }) => {

  const req = nextReq as any

  let discount

  try {
    const { data } = await api.get(`/api/discounts/${params?.id}`, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    discount = data.discount

  } catch (error) {
    console.log({ error })
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      discount,
    },
  };
}

export default DiscountDetailsPage