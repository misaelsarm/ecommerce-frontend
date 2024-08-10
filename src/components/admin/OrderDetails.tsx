import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Modal from '../../ui/Modal'
import { Order } from '@/interfaces/'
import Select from 'react-select'
import toast from 'react-hot-toast'
import moment from 'moment'
import TextArea from '../../ui/TextArea'
import { useRouter } from 'next/router'
import statesData from '../../../utils/states.json'
import Input from '@/components/ui/Input'
import CartItem from '@/components/CartItem'
import { makeRequest } from '@/utils/makeRequest'

interface Props {
  order: Order
}

const OrderDetails = ({ order }: Props) => {

  const { back, replace } = useRouter()

  let states = Object.keys(statesData)

  const [currentState, setCurrentState] = useState("")

  const [editing, setEditing] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const resetOrder = {
      ...order,
      status: {
        label: order.status,
        value: order.status
      },
      shippingAddress: {
        ...order.shippingAddress,
        city: {
          label: order.shippingAddress.city,
          value: order.shippingAddress.city
        },
        state: {
          label: order.shippingAddress.state,
          value: order.shippingAddress.state
        },
        colonia: order.shippingAddress.colonia
      }
    }
    reset(resetOrder)
  }, [])

  const onSubmit = async (values: any) => {
    setSaving(true)

    const update = {
      ...values,
      status: values.status.value,
      shippingAddress: {
        city: values.shippingAddress.city.value,
        state: values.shippingAddress.state.value,
        street: values.shippingAddress.street,
        colonia: values.shippingAddress.colonia,
        postalCode: values.shippingAddress.postalCode,
      },
    }

    try {
      /* await api.put(`/api/orders/${order.number}`, update, {
        headers: {
          "x-access-token": Cookies.get('token')
        }
      }) */
      await makeRequest('put', `/api/orders/${order.number}`, update)
      toast.success('Pedido actualizado con exito')
      setSaving(false)
      setEditing(false)
      replace(`/admin/orders/${order.number}`)
      //TODO
      // fetchData()
    } catch (error: any) {
      toast.error(error.response.data.message)
      setSaving(false)
    }
  }

  const renderForm = () => {
    return (
      <div>
        <div className="group">
          <Input
            name='guideNumber'
            register={register}
            placeholder='Número de guía'
            label='Número de guía'
          />
        </div>
        <div className="group">
          <Input
            name='shippingName'
            register={register}
            placeholder='Paquetería'
            label='Paquetería'
          />
        </div>
        <div className="group">
          <span>Estado de pedido</span>
          <Controller
            name="status"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) =>
              <Select
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder='Estado de pedido'
                isSearchable={true}
                options={[
                  {
                    label: 'Nuevo',
                    value: 'Nuevo'
                  },
                  {
                    label: 'En camino',
                    value: 'En camino'
                  },
                  {
                    label: 'Entregado',
                    value: 'Entregado'
                  },
                  {
                    label: 'Cancelado',
                    value: 'Cancelado'
                  },
                  {
                    label: 'Pendiente de pago',
                    value: 'Pendiente de pago'
                  },
                ]}
              />}
          />
          {errors.status && <span className='error'>Campo requerido</span>}
        </div>
        <h4>
          Datos personales y de entrega
        </h4>

        <div className="group">
          <Input
            name='customer'
            register={register}
            placeholder='Nombre y apellido'
            required
            label='Nombre y apellido'
            errors={errors}
          />
        </div>

        <div className="group">
          <Input
            type='email'
            name='email'
            register={register}
            placeholder='Correo electrónico'
            label='Correo electrónico'
            errors={errors}
          />
        </div>

        <div className="group">
          <Input
            name='phone'
            register={register}
            placeholder='Teléfono de contacto'
            required
            label='Teléfono de contacto'
            errors={errors}
          />
        </div>

        <h4>Dirección de entrega</h4>
        <>
          <div className="input-group">
            <Controller
              rules={{
                required: true,
              }}
              name="shippingAddress.state"
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                <Select
                  onChange={async (e) => {
                    onChange(e)
                    setCurrentState(e.value)
                  }}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Estado'
                  isSearchable={true}
                  options={states.map(item => ({
                    value: item,
                    label: item
                  }))}
                />}
            />
            {errors.state && <span className='error'>Campo requerido</span>}
          </div>
          <div className="input-group">
            <Controller
              rules={{
                required: true,
              }}
              name="shippingAddress.city"
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                <Select
                  onChange={async (e) => {
                    onChange(e)

                  }}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Ciudad'
                  isSearchable={true}
                  //@ts-ignore
                  options={statesData[currentState]?.map((item: string) => ({
                    value: item,
                    label: item
                  }))}
                />}
            />
            {errors.city && <span className='error'>Campo requerido</span>}
          </div>
          <div className="group">
            <Input
              label='Calle y número'
              name='shippingAddress.street'
              errors={errors}
              placeholder='Calle y número'
              register={register}
              required
            />
          </div>
          <div className="group">
            <Input
              label='Colonia'
              name='shippingAddress.colonia'
              errors={errors}
              placeholder='Colonia'
              register={register}
              required
            />
          </div>
          <div className="group">
            <Input
              label='Apartamento, suite, etc. (Opcional)'
              name='shippingAddress.apartment'
              errors={errors}
              placeholder='Apartamento, suite, etc. (Opcional)'
              register={register}
            />
          </div>
          <div className="group">
            <Input
              label='Código postal'
              name='shippingAddress.postalCode'
              errors={errors}
              placeholder='Codigo Postal'
              register={register}
              required
              inputMode='numeric'
            />
          </div>
        </>
        <div className="group">
          <TextArea
            register={register}
            label='Instrucciones de entrega (Opcional)'
            placeholder=''
            name='specialInstructions'
            errors={errors}
          />
        </div>
        <div className="group">
          <Input
            type='number'
            name='subTotal'
            register={register}
            placeholder='Subtotal'
            label='Subtotal'
            errors={errors}
          />
        </div>
        <div className="group">
          <Input
            type='number'
            name='shippingFee'
            register={register}
            placeholder='Envío'
            required
            label='Envío'
            errors={errors}
          />
        </div>
        <div className="group">
          <Input
            type='number'
            name='total'
            register={register}
            placeholder='Total'
            required
            label='Total'
            errors={errors}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='detailPage'>
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
        </div>
        <div className="card">
          <>
            <div className="cardItem">
              <h4>Numero de pedido</h4>
              <span>{order.number}</span>
            </div>
            <div className="cardItem">
              <h4>Numero de guía</h4>
              <span>{order.guideNumber}</span>
            </div>
            <div className="cardItem">
              <h4>Paquetería</h4>
              <span>{order.shippingName}</span>
            </div>
            <div className="cardItem">
              <h4>Estado</h4>
              <span>{order.status}</span>
            </div>
            <div className="cardItem">
              <h4>Dirección de entrega</h4>
              <span>{order.shippingAddress?.street}, {order.shippingAddress.colonia}, {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}</span>
            </div>
            <div className="cardItem">
              <h4>Instrucciones de entrega</h4>
              {
                <span>{order.specialInstructions} {order.apartment}</span>
              }
            </div>
            <div className="cardItem">
              <h4>Información de cliente</h4>
              <span>{order.customer}</span>
              <span>{order.email}</span>
              <span>{order.phone}</span>
            </div>
            {
              order.invoiceRequired &&
              <div className="cardItem">
                <h4>Información de facturación</h4>
                <span>RFC: {order.tax.rfc}</span>
                <span>Razón social: {order.tax.razonSocial}</span>
                <span>Uso CFDI: {order.tax.usoCfdi.label}</span>
                <a target='_blank' rel='noreferrer' href={order.tax.fileUrl} >Ver Constancia de situacion fiscal</a>
              </div>
            }
            <div className="cardItem">
              <h4>Tipo de pedido</h4>
              <span>{order.type}</span>
            </div>
            <div className="cardItem">
              <h4>Fecha de compra</h4>
              <span>{moment(order.createdAt).format('lll')}</span>
            </div>
            <div className="cardItem">
              <h4>Productos</h4>
              {
                order.cart && order.cart.items.map(product => (
                  <CartItem
                    showAttributes
                    key={product.cartItemId}
                    {...product}
                  />
                ))
              }
            </div>
            <div className="cardItem">
              <h4>Información de pago</h4>
              <div className="listItem">
                <span>Subtotal de articulos:</span>
                <span> $ {order.subTotal.toFixed(2)} MXN</span>
              </div>

              <div className="listItem">
                <span>Envío:</span>
                <span>$ {order.shippingFee.toFixed(2)} MXN</span>
              </div>

              {
                order.cart && order.cart.discount &&
                <div className="listItem" >
                  <span>Descuento: {order.cart.discount.name} (-{order.cart.discount.type.value === 'fixed' ? `$ ${order.cart.discount.value.toFixed(2)} MXN` : `${order.cart.discount.value}%`})</span>
                  <span>- $ {
                    order.cart.discount.type.value === 'percentage' ? (order.subTotal * (order.cart.discount.value / 100)).toFixed(2) : 0
                  } MXN</span>
                </div>
              }
              <div className="listItem">
                <span>Total:</span>
                <span>$ {order.total.toFixed(2)} MXN</span>
              </div>
            </div>
          </>
        </div>
      </div >
      <Modal
        visible={editing}
        loadingState={saving}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Editar pedido'
        onClose={() => {
          setEditing(false)
        }}
      >
        {renderForm()}
      </Modal>
    </>
  )
}


export default OrderDetails