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
import Select from '@/components/common/Select/Select';

const SignUpPage = () => {

  const { setUser, setLoading: setContextLoading } = useContext(AuthContext)

  const { register, handleSubmit, formState: { errors }, control } = useForm();

  const { replace, query } = useRouter()

  const { returnUrl } = query;

  const [loading, setLoading] = useState(false)

  const signUp = async (values: any) => {

    const payload = {
      ...values,
    }

    setLoading(true)

    try {
      const data = await makeRequest('post', `/api/auth/sign-up`, payload)
      Cookies.set('token', data.token);
      Cookies.set('userId', data.id);
      let redirectUrl = returnUrl as string || '/events'; // Default page after login

      replace(redirectUrl);
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
        <form onSubmit={handleSubmit(signUp)} className={styles.form}>
          <div className={styles.formHeader}>
            <h2>Crea una cuenta en Selli</h2>
          </div>
          <div className={styles.fields}>
            <Input
              register={register}
              name='email'
              type='email'
              errors={errors}
              label='Email'
              required
              pattern={/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/}
            />
            <Input
              register={register}
              name='password'
              type='password'
              errors={errors}
              label='Password'
              required
            />
          </div>
          <div className={styles.actions}>
            <button disabled={loading} className='btn btn-primary btn-block'>Crear cuenta</button>
            <Link className='btn btn-ghost btn-block' href='/admin/login'>¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUpPage
