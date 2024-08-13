import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '@/api_config/api';
import styles from '@/styles/admin/Login.module.scss'
import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/common/Input';

const AdminLoginPage = () => {

  //const { setUser } = useContext(AuthContext)

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { replace, query } = useRouter()

  const { returnUrl } = query;

  const [loading, setLoading] = useState(false)

  const login = async ({ email, password }: any) => {
    setLoading(true)
    try {
      const { data } = await api.post(`/api/auth/login`, { email, password, location: 'admin' })
      Cookies.set('token', data.token);
      const redirectUrl = returnUrl as string || '/admin/orders?page=1&limit=20'; // Default page after login
      replace(redirectUrl);
      //replace('/admin/orders?page=1&limit=20')
      //setUser(data)
      setLoading(false)

    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
    }

  }

  return (
    <div className={styles.login}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <h1 style={{
            textAlign: 'center'
          }}>Tu logo aquí</h1>
          {/*  <img src="/logo.png" alt="" /> */}
        </div>
        <form onSubmit={handleSubmit(login)} className={styles.form}>
          <div className="group">
            <Input
              register={register}
              placeholder='Correo electrónico'
              name='email'
              type='email'
              errors={errors}
              label='Correo eléctronico'
              required
            />
          </div>
          <div className="group">
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
          <div className="group">
            <button disabled={loading} className='btn btn-black btn-block'>Iniciar sesión</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
