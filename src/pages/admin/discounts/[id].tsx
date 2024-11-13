import Layout from '@/components/admin/Layout'
import Checkbox from '@/components/common/Checkbox';
import Chip from '@/components/common/Chip';
import DatePicker from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Select from '@/components/common/Select';
import { AuthContext } from '@/context/auth/AuthContext';
import { CollectionInterface, DiscountInterface, ProductInterface } from '@/interfaces';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { hasPermission } from '@/utils/hasPermission';
import { makeRequest } from '@/utils/makeRequest';
import { discountLimitByMap, discountTypesMap } from '@/utils/mappings';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
  discount: DiscountInterface
}

const DiscountDetailsPage = ({ discount }: Props) => {

  const [editing, setEditing] = useState(false)

  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<any>({
    defaultValues:
    {
      "name": discount.name,
      "value": discount.value,
      "active": discount.active,
      "endDate": discount.endDate,
      "applicableProducts": discount.applicableProducts?.map(item => ({
        label: item.name,
        value: item._id
      })),
      "applicableCollections": discount.applicableCollections?.map(item => ({
        label: item.name,
        value: item._id
      })),
      limitBy: {
        label: discountLimitByMap[discount.limitBy],
        value: discount.limitBy
      },
      type: {
        label: discountTypesMap[discount.type],
        value: discount.type
      },
      limited: discount.limited
    }

  });

  const [limitBy, setLimitBy] = useState(discount.limitBy)

  const [discountType, setDiscountType] = useState(discount.type)

  const [products, setProducts] = useState<ProductInterface[]>([])

  const [limited, setLimited] = useState(discount.limited)

  const [collections, setCollections] = useState<CollectionInterface[]>([])

  const { query: { id }, back, replace, pathname } = useRouter()

  const fetchProducts = async () => {
    try {
      const data = await makeRequest('get', '/api/products?active=true')
      setProducts(data.products)
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.log({ error })
    }
  }

  const fetchCollections = async () => {
    try {
      const data = await makeRequest('get', '/api/collections?active=true')
      setCollections(data.collections)
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.log({ error })
    }
  }

  const onSubmit = async (values: any) => {
    try {

      let validProducts: string[] = []

      let validCollections: string[] = []

      let foundProducts = []

      if (limitBy === 'collection') {

        let selectedCollections: string[] = values.applicableCollections.map((cat: any) => cat.value)

        for (const product of products) {

          for (const col of product.collections) {
            if (selectedCollections.includes(col._id)) {
              foundProducts.push(product._id)
            }
          }
        }

        validProducts = foundProducts
        validCollections = selectedCollections

      } else {
        validProducts = values.applicableProducts?.map((product: any) => product.value)
        validCollections = []
      }

      const discount = {
        ...values,
        //@ts-ignore
        applicableProducts: [...new Set(validProducts)],
        applicableCollections: validCollections,
        type: values.type.value,
        limitBy: values.limitBy.value
      }

      setSaving(true)

      await makeRequest('put', `/api/discounts/${id}`, discount);

      toast.success('Descuento actualizado')
      setSaving(false)
      setEditing(false)
      replace(`/admin/discounts/${id}`)
    } catch (error: any) {
      if (error) {
        toast.error(error?.response?.data?.message || 'Error al guardar descuento. ' + error)
        setSaving(false)
      }
    }
  }

  const { user } = useContext(AuthContext)

  const canCreateEdit = user.role === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

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
          //@ts-ignore
          discountType !== '' &&
          <>
            <div className="d-flex align-center">
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
            <DatePicker
              label="Fecha de expiración"
              control={control}
              required
              errors={errors}
              name="endDate"
            />
            <Checkbox
              label='Activo'
              id='active'
              name='active'
              register={register}
            />
            <Checkbox
              register={register}
              label='Limitar a productos o colecciones'
              id='limited'
              name='limited'
              onChange={(e) => {
                setLimited(e.target.checked)
              }}
            />
          </>
        }
        {
          limited &&
          <>
            <Select
              onChange={(e: any) => {
                setLimitBy(e.value)
              }}
              required
              options={[
                {
                  label: 'Colección',
                  value: 'collection'
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
            {
              limitBy === 'collection' &&
              <Select
                required
                options={collections.map(collection => ({
                  label: collection.name,
                  value: collection._id
                }))}
                errors={errors}
                control={control}
                isMulti
                name='applicableCollections'
                label='Colecciones que aplican'
              />
            }
            {
              limitBy === 'product' &&
              <Select
                required
                options={products.map(product => ({
                  label: product.name,
                  value: product._id
                }))}
                errors={errors}
                control={control}
                isMulti
                name='applicableProducts'
                label='Productos que aplican'
              />
            }
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
              !editing && canCreateEdit && <button className='btn btn-black' onClick={() => {
                setEditing(true)
                fetchProducts()
                fetchCollections()
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
              <span>{discountTypesMap[discount.type]}</span>
            </div>
            <div className="cardItem">
              <h4>Valor del descuento</h4>
              <span>{discount.type === 'percentage' ? `${discount.value}%` : `$ ${discount.value.toFixed(2)} MXN`}</span>
            </div>
            <div className="cardItem">
              <h4>Fecha de expiración</h4>
              <span>{moment(discount.endDate).format('ll')}</span>
            </div>
            <div className="cardItem">
              <h4>Estado</h4>
              {
                discount.active ? <Chip text='Activo' color='green' /> : <Chip text='No activo' />
              }
            </div>
            {
              discount.limited && <div className="cardItem">
                <h4>Elegibilidad</h4>
                <span>Este descuento solo aplica para los siguientes productos: </span>
                <br />
                {
                  discount?.applicableProducts?.map(product => (
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

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

  let discount

  const token = getServerSideToken(req)

  try {
    const data = await makeRequest('get', `/api/discounts/${params?.id}`, {}, {
      headers: {
        //@ts-ignore
        "x-access-token": token,
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