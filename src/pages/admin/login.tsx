import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styles from '@/styles/admin/Auth.module.scss'
import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/common/Input/Input';
import { AuthContext } from '@/context/auth/AuthContext';
import { makeRequest } from '@/utils/makeRequest';
import Link from 'next/link';

const AdminLoginPage = () => {

  const { setUser, setLoading: setContextLoading } = useContext(AuthContext)

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { replace, query } = useRouter()

  const { returnUrl } = query;

  const [loading, setLoading] = useState(false)

  const login = async ({ email, password }: any) => {
    setLoading(true)
    try {
      const data = await makeRequest('post', `/api/auth/login`, { email, password, location: 'admin' })
      Cookies.set('token', data.token);
      const redirectUrl = returnUrl as string || '/admin/orders?page=1&limit=20'; // Default page after login
      replace(redirectUrl);
      console.log({ data })
      setUser(data)
      setLoading(false)
      setContextLoading(false)

    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
    }

  }

  return (
    <div className={styles.auth}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <h1 style={{
            textAlign: 'center'
          }}>Tu logo aquí</h1>
          {/*  <img src="/logo.png" alt="" /> */}
        </div>
        <form onSubmit={handleSubmit(login)}>
          <div className={styles.formHeader}>
            <h2>Inicia sesión en Selli</h2>
          </div>
          <div className={styles.fields}>
            <Input
              register={register}
              placeholder='Correo electrónico'
              name='email'
              type='email'
              errors={errors}
              label='Correo eléctronico'
              required
            />
            <Input
              register={register}
              placeholder='Contraseña'
              name='password'
              type='password'
              errors={errors}
              label='Contraseña'
              required
            />
          </div>
          <div className={styles.actions}>
            <button disabled={loading} className='btn btn-primary btn-block'>Iniciar sesión</button>
            <Link className='btn btn-ghost btn-block' href='/admin/sign-up'>¿No tienes cuenta? Crea una ahora</Link>
            <Link className='btn btn-ghost btn-block' href='/admin/forgot-password'>¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
