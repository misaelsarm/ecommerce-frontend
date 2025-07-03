import AccountLayout from '@/components/online-store/AccountLayout';
import { Layout } from '@/components/online-store/Layout';
import React, { ReactElement, useState } from 'react'
import styles from '@/styles/online-store/account/Addresses.module.scss'
import { AddressInterface } from '@/interfaces/Address';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { makeRequest } from '@/utils/makeRequest';
import Empty from '@/components/online-store/Empty';
import Modal from '@/components/common/Modal/Modal';
import Input from '@/components/common/Input/Input';
import Select from '@/components/common/Select/Select';
import TextArea from '@/components/common/TextArea/TextArea';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import { GetServerSideProps } from 'next';
import { getServerSideToken } from '@/utils/getServerSideToken';

interface Props {
  addresses: AddressInterface[],
  error: {
    error: number,
    message: string
  }
}

const AccountaddressesPage = ({ addresses, error }: Props) => {

  const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

  const [visible, setVisible] = useState(false)

  const [currentEditing, setCurrentEditing] = useState<string | undefined>()

  const [loading, setLoading] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const { replace } = useRouter()

  const onSubmit = async (values: any) => {
    setLoading(true)
    const data = {
      receiverName: values.receiverName,
      receiverPhone: values.receiverPhone,
      city: values.city.value,
      street: values.street,
      colonia: values.colonia,
      apartment: values.apartment,
      postalCode: values.postalCode,
      deliveryInstructions: values.deliveryInstructions,
      main: values.main
    }

    if (currentEditing) {
      try {
        await makeRequest('put', `/api/me/addresses/${currentEditing}`, data)
        toast.success('Se actualizó la dirección con éxito')
        reset({})
        setCurrentEditing(undefined)
        setVisible(false)
        replace('/account/addresses')
        setLoading(false)
      } catch (error) {
        toast.error('Ocurrio un error al actualizar la dirección')
        setLoading(false)
      }
    } else {
      try {
        await makeRequest('post', '/api/me/addresses', data)
        toast.success('Se agregó la dirección con éxito')
        reset({})
        setCurrentEditing(undefined)
        setVisible(false)
        replace('/account/addresses')
        setLoading(false)
      } catch (error) {
        toast.error('Ocurrio un error al agregar la dirección')
        setLoading(false)
      }
    }

  }

  return (
    <>
      {
        error ? <div style={{
          height: '50dvh'
        }}>
          <h2>{error.message}</h2>
        </div> : <>
          <div className={styles.addresses}>
            {
              addresses.length === 0 && <Empty title='Aún no has agregado direcciones' icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              } />
            }
            <div className={styles.grid}>
              {
                addresses.map(({ _id, receiverName, receiverPhone, city, street, colonia, postalCode, main,
                  apartment,
                  deliveryInstructions }) => (
                  <div key={_id} className={styles.item}>
                    <div className={styles.icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                      </svg>
                    </div>
                    <div className={styles.info}>
                      <span>{receiverName}</span>
                      <span>{receiverPhone}</span>
                      <span>{street}, {colonia}, {postalCode}, {city}, Nuevo León</span>
                    </div>
                    <div className={styles.actions}>
                      <button
                        onClick={() => {
                          setVisible(true)
                          reset({
                            receiverName,
                            receiverPhone,
                            city: {
                              label: city,
                              value: city
                            },
                            street,
                            colonia,
                            postalCode,
                            main,
                            apartment,
                            deliveryInstructions
                          })
                          setCurrentEditing(_id)
                        }}
                        className='btn btn-primary'>Editar</button>
                      <button
                        onClick={() => {
                          setConfirmDelete(true)
                          setCurrentEditing(_id)
                        }}
                        className='btn'>Eliminar</button>
                    </div>
                  </div>
                ))
              }
            </div>
            <div
              className={styles.add}>
              <button onClick={() => {
                setVisible(true)
                setCurrentEditing(undefined)
              }} className='btn btn-primary'>Agregar dirección</button>
            </div>
          </div>
          <Modal
            visible={visible}
            title={currentEditing ? 'Editar dirección' : 'Agregar dirección'}
            onOk={handleSubmit(onSubmit)}
            loadingState={loading}
            onCancel={() => {
              setVisible(false)
              setCurrentEditing(undefined)
              reset({})
            }}
            onClose={() => {
              setVisible(false)
              setCurrentEditing(undefined)
              reset({})
            }}

          >
            <>
              <Input
                name='receiverName'
                register={register}
                required
                label='Nombre de quien recibe'
                errors={errors}
              />
              <Input
                name='receiverPhone'
                register={register}
                required
                label='Teléfono de quien recibe'
                errors={errors}
              />
              {/* <Select
                required
                control={control}
                options={cityList.map(item => ({
                  value: item,
                  label: item
                }))}
                name="city"
                errors={errors}
                label="Municipio"
              /> */}
              <Input
                label='Calle y número'
                name='street'
                errors={errors}

                register={register}
                required
              />
              <Input
                label='Colonia'
                name='colonia'
                errors={errors}

                register={register}
                required
              />
              <Input
                label='Tipo de edificio (casa, oficina, departamento, etc)'
                name='apartment'
                errors={errors}
                required
                register={register}
              />
              <Input
                label='Código postal'
                name='postalCode'
                errors={errors}

                register={register}
                required
                inputMode='numeric'
              />
              <TextArea
                register={register}
                label='Instrucciones de entrega (Opcional)'
                name='deliveryInstructions'
                errors={errors}
              />
              <Checkbox
                register={register}
                label='Establecer como dirección de entrega principal'
                id='main'
                name='main'
              />
            </>
          </Modal>
          <Modal
            loadingState={loading}
            title="Eliminar dirección"
            wrapperStyle={{
              height: 'auto',
              width: 400
            }}
            bodyStyle={{
              height: 'auto'
            }}
            visible={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onCancel={() => setConfirmDelete(false)}
            onOk={async () => {
              try {
                setLoading(true)
                await makeRequest('put', `/api/me/addresses/${currentEditing}`, { deleted: true, active: false })
                toast.success(`Se eliminó la dirección`)
                setConfirmDelete(false);

                replace('/account/addresses')
                setLoading(false)
              } catch (error: any) {
                setLoading(false)
                toast.error(error.response.data.message)
              }
            }}
          >
            <div><span>¿Confirmar eliminación? Esta acción no se puede deshacer.</span></div>
          </Modal>
        </>
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  let addresses = []

  let errorCode = null;

  let errorMessage = null;

  let data

  const url = `/api/me/addresses`

  try {

    const token = getServerSideToken(req)

    data = await makeRequest('get', url, {}, {
      headers: {
        "x-access-token": token,
      }
    })

    addresses = data.addresses;

  } catch (error: any) {
    errorCode = error.response?.status
    errorMessage = error.response?.data.message

  }

  // Handle redirection or returning error code
  if (errorCode) {
    return {
      props: {
        error: {
          error: errorCode,
          message: errorMessage
        }
      },
    };
  }

  return {
    props: {
      addresses
    },
  };
}

AccountaddressesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Direcciones">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};

export default AccountaddressesPage