import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styles from '@/styles/admin/Auth.module.scss'
import { useState } from 'react';
import Input from '@/components/common/Input/Input';
import { makeRequest } from '@/utils/makeRequest';
import Link from 'next/link';

const AdminLoginPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false)

  const login = async ({ email }: any) => {
    setLoading(true)
    try {
      await makeRequest('post', `/api/auth/recover`, { email })

      toast.success('Email sent with instructions', {
        duration: 6000
      })
      setLoading(false)

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
        <form onSubmit={handleSubmit(login)} className={styles.form}>
          <div className={styles.formHeader}>
            <h2>¿Olvidaste tu contraseña?</h2>
            <span>Escribe el correo electrónico que utilizaste cuando te registraste. Te enviaremos las instrucciones
              para recuperar tu contraseña. (Si no ves el correo, revisa tu SPAM).</span>
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
          </div>
          <div className={styles.actions}>
            <button disabled={loading} className='btn btn-primary btn-block'>Confirm</button>
            <Link className='btn btn-ghost btn-block' href='/admin/login'>¿Ya tienes cuenta? Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
