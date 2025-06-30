import AccountLayout from '@/components/online-store/AccountLayout';
import { Layout } from '@/components/online-store/Layout';
import React, { ReactElement, useContext, useState } from 'react'
import styles from '@/styles/online-store/account/Profile.module.scss'
import Input from '@/components/common/Input';
import { useForm } from 'react-hook-form';
import { AuthContext } from '@/context/auth';
import { GetServerSideProps } from 'next';
import { getServerSideToken } from '@/utils/getServerSideToken';
import { makeRequest } from '@/utils/makeRequest';
import { getServerSideUserId } from '@/utils/getServerSideUserId';
import { UserInterface } from '@/interfaces';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface Props {
  user: UserInterface
}

const AccountProfilePage = ({ user }: Props) => {

  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone
    }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, watch, formState: { errors: passwordErrors } } = useForm<any>();

  const [editingInfo, setEditingInfo] = useState(false)

  const [editingPassword, setEditingPassword] = useState(false)

  const { replace } = useRouter()

  const [loading, setLoading] = useState(false)

  const { setUser } = useContext(AuthContext)

  const handleSavePassword = async (values: any) => {
    try {
      setLoading(true)
      await makeRequest('put', `/api/users/${user._id}`, { ...values })
      setEditingPassword(false)
      toast.success('Se guardaron los cambios.')
      replace('/account/profile')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error al guardar perfil')
    }

  }

  const handleSaveInfo = async (values: any) => {
    try {
      setLoading(true)
      await makeRequest('put', `/api/users/${user._id}`, { ...values })
      setEditingInfo(false)
      toast.success('Se guardaron los cambios.')
      replace('/account/profile')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Error al guardar perfil')
    }

  }

  return (

    <div className="account">
      <div className={styles.profile}>

        <div className={styles.form}>
          <div className={styles.header}>
            <h4>Información personal</h4>
            <div className={styles.actions}>
              {
                editingInfo ? <>
                  <button disabled={loading} onClick={handleSubmit(handleSaveInfo)} className='btn btn-primary'>Guardar</button>
                  <button disabled={loading} onClick={() => {
                    setEditingInfo(false)
                  }} className='btn'>Cancelar</button> </> : <button disabled={loading} onClick={() => {
                    setEditingInfo(true)
                  }} className='btn btn-primary'>Editar</button>
              }
            </div>
          </div>

          <div className="account-card">
            {
              editingInfo ? <>
                <Input
                  name='name'
                  register={register}
                  required
                  label='Nombre(s) y apellido(s)'
                  errors={errors}
                />
                <Input
                  type='email'
                  name='email'
                  register={register}
                  label='Correo electrónico'
                  errors={errors}
                  required
                  pattern={/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/}
                />
                <Input
                  name='phone'
                  register={register}
                  required
                  label='Teléfono de contacto'
                  errors={errors}
                />
              </> : <>
                <div className='field'>
                  <h4>Nombre(s) y apellido(s)</h4>
                  <span>{user.name}</span>
                </div>
                <div className='field'>
                  <h4>Correo electrónico</h4>
                  <span>{user.email}</span>
                </div>
                <div className='field'>
                  <h4>Telefono</h4>
                  <span>{user.phone}</span>
                </div>
              </>
            }
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.header}>
            <h4>Contraseña</h4>
            <div className={styles.actions}>
              {
                editingPassword ? <>
                  <button disabled={loading} onClick={handleSubmitPassword(handleSavePassword)} className='btn btn-primary'>Guardar</button>
                  <button disabled={loading} onClick={() => {
                    setEditingPassword(false)
                  }} className='btn'>Cancelar</button> </> : <button disabled={loading} onClick={() => {
                    setEditingPassword(true)
                  }} className='btn btn-primary'>Cambiar contraseña</button>
              }
            </div>
          </div>

          <div className="account-card">
            {
              editingPassword ? <>
                <div style={{
                  maxWidth: 400
                }}>
                  <Input
                    register={registerPassword}
                    name='password'
                    label='Nueva contraseña'
                    type='password'
                    required
                    errors={passwordErrors}
                  />
                </div>
                <div style={{
                  maxWidth: 400
                }}>
                  <Input
                    register={registerPassword}
                    name='confirm_password'
                    label='Repetir contraseña'
                    type='password'
                    required
                    errors={passwordErrors}
                    validate={
                      (val: string) => {
                        if (watch('password') != val) {
                          return "Tus contraseñas no coinciden";
                        }
                      }
                    }
                  />
                </div>
              </> : <div className='field'>
                <h4>Contraseña</h4>
                ***************
              </div>
            }
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('token')
            Cookies.remove('token')
            replace('/')
            setUser({} as UserInterface)
          }}
          className='btn btn-primary'>Cerrar sesión</button>

      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {

  let user

  const token = getServerSideToken(req)

  const userId = getServerSideUserId(req)

  try {
    const data = await makeRequest('get', `/api/users/${userId}`, {}, {
      headers:
      {
        "x-access-token": token
      }
    })
    user = data.user
  } catch (error) {

  }

  return {
    props: {

      user
    }
  }
}

AccountProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Pedidos">
      <AccountLayout>{page}</AccountLayout>
    </Layout>
  );
};

export default AccountProfilePage