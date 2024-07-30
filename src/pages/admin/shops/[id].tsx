import { api } from '@/api_config/api'
import Layout from '@/components/admin/Layout'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import TextArea from '@/components/ui/TextArea'
import { Shop } from '@/interfaces/Shop'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import statesData from '@/utils/states.json'
import toast from 'react-hot-toast'
import { makeRequest } from '@/utils/makeRequest'

interface Props {
  shop: Shop
}

const ShopDetails = ({ shop }: Props) => {

  let states = Object.keys(statesData)

  let shopId = shop.id

  const [editing, setEditing] = useState(false)

  const [currentState, setCurrentState] = useState("")

  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors }, control, resetField } = useForm();

  const { back } = useRouter()

  const onSubmit = async (values: any) => {

    const shop = {
      ...values,
      active: values.active,
      state: values.state?.value,
      cities: values.cities?.map((city: any) => city.value),
    }
    setSaving(true)
    try {
      await makeRequest('put', `/api/shops/${shopId}`, shop)
      toast.success('Tienda actualizada')
      setSaving(false)
      reset()
      setEditing(false)
      window.location.reload()
    } catch (error: any) {
      if (error) {
        toast.error(error.response.data.message)
        setSaving(false)
      }
    }
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
                reset({
                  ...shop as any,
                  cities: shop.cities.map(city => ({
                    label: city,
                    value: city
                  })),
                  state: {
                    label: shop.state,
                    value: shop.state,
                  }
                })
              }}>Editar</button>
            }
          </div>
          <div className="card">
            <>
              <div className="cardItem">
                <h4>Nombre</h4>
                <span>{shop.name}</span>
              </div>
              <div
                className="cardItem">
                <h4>Dirección</h4>
                <span>{shop.address}</span>
              </div>
              <div
                className="cardItem">
                <h4>notificaciones de pedidos</h4>
                <span>Al recibir pedidos de las siguientes ubicaciones: </span>
                <br />
                <span>{shop.state}</span>
                <br />
                {
                  shop.cities.map(city => (
                    <span key={city}>- {city}</span>
                  ))
                }
                <br />
                <span>Notificar al siguiente correo:</span>
                <span>{shop.email}</span>
              </div>
              <div className="cardItem">
                <h4>Teléfono</h4>
                <span>{shop.phone || 'No proporcionado'}</span>
              </div>
              <div
                style={{
                  whiteSpace: 'pre-line'
                }}
                className="cardItem">
                <h4>Horario</h4>
                <span>{shop.schedule}</span>
              </div>
              <div className="cardItem">
                <h4>Facebook</h4>
                <span>{shop.facebook}</span>
              </div>
              <div className="cardItem">
                <h4>Instagram</h4>
                <span>{shop.instagram}</span>
              </div>
              <div className="cardItem">
                <h4>TikTok</h4>
                <span>{shop.tiktok || 'No proporcionado'}</span>
              </div>
              <div className="cardItem">
                <h4>X</h4>
                <span>{shop.x || 'No proporcionado'}</span>
              </div>
              <div className="cardItem">
                <h4>Google Maps</h4>
                <span
                  style={{
                    wordBreak: 'break-word'
                  }}
                >{shop.googleMaps}</span>
              </div>
              <div className="cardItem">
                <h4>Activa</h4>
                <span>{shop.active ? 'Activa' : 'No activa'}</span>
              </div>
            </>
          </div>
        </>
      </div >
      <Modal
        loadingState={saving}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setEditing(false)
        }}
        title='Nueva tienda'
        onClose={() => {
          setEditing(false)
        }}
        visible={editing}
      >
        <div>
          <div className="group">
            <Input
              register={register}
              label='Nombre'
              placeholder=''
              name='name'
              errors={errors}
              required
            />
          </div>
          <div className="cardItem">
            <h4>notificaciones de pedidos</h4>
            <span>Al recibir pedidos de las siguientes ubicaciones: </span>
            <div className="group">
              <Select
                options={states.map(item => ({
                  value: item,
                  label: item
                }))}
                errors={errors}
                control={control}
                onChange={async (e: any) => {
                  resetField('cities', {
                    defaultValue: []
                  })
                  setCurrentState(e.value)
                }}
                name='state'
                label='Estado'
              />
            </div>
            <div className="group">
              <Select
                //@ts-ignore
                options={statesData[currentState]?.map((item: string) => ({
                  value: item,
                  label: item
                }))}
                errors={errors}
                control={control}
                name='cities'
                label='Ciudad(es)'
                isMulti
              />
            </div>
            <span>Notificar al siguiente correo:</span>
            <div className="group">
              <Input
                register={register}
                label=''
                placeholder='email@example.com'
                name='email'
                type='email'
                errors={errors}
              />
            </div>
          </div>
          <div className="group">
            <TextArea
              register={register}
              label='Dirección'
              placeholder=''
              name='address'
              required
              errors={errors}
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Teléfono'
              name='phone'
            />
          </div>
          <div className="group">
            <TextArea
              register={register}
              label='Horario'
              placeholder=''
              name='schedule'
              required
              errors={errors}
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Facebook'
              placeholder=''
              name='facebook'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Instagram'
              placeholder=''
              name='instagram'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='X'
              placeholder=''
              name='x'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='TikTok'
              placeholder=''
              name='tiktok'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Link de Google Maps'
              placeholder=''
              name='googleMaps'
            />
          </div>
          <div className="group">
            <input {...register('active')} type="checkbox" name="active" id="active" />
            <label htmlFor="active">Activa</label>
          </div>
        </div>
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const id = params?.id

  let shop

  try {
    const { data } = await api.get(`/api/shops/${id}`)
    shop = data.shop
  } catch (error) {

  }

  return {
    props: {

      shop
    }
  }
}

ShopDetails.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="ShopDetails">
      {page}
    </Layout>
  );
};

export default ShopDetails