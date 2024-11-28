import React, { useContext, useState } from 'react';
import styles from '@/styles/Auth.module.scss';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/auth/AuthContext';
import Cookies from 'js-cookie';
import { UIContext } from '@/context/ui/UIContext';
import { makeRequest } from '@/utils/makeRequest';
import Input from './common/Input';

interface AuthFormValues {
  email: string;
  password?: string;
  name?: string;
}

const Auth = () => {

  const [type, setType] = useState<'login' | 'sign-up' | 'forgot-password'>('login');

  const handleTypeChange = (newType: 'login' | 'sign-up' | 'forgot-password') => {
    setType(newType);
  };

  const { setUser } = useContext(AuthContext)

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false)

  const { replace } = useRouter()

  const { setVisible } = useContext(UIContext)

  const renderHeaderMessage = () => {
    switch (type) {
      case 'login':
        return 'Inicia sesión en tu cuenta';
      case 'sign-up':
        return 'Crea tu cuenta';
      case 'forgot-password':
        return 'Recuperar contraseña';
      default:
        return '';
    }
  };

  const handleSignUp = async (values: AuthFormValues) => {

    try {
      setLoading(true)
      const data = await makeRequest('post', '/api/auth/sign-up', values)
      toast.success('Cuenta creada', { duration: 6000 })
      setLoading(false)
      replace('/account')
      setUser(data)
      Cookies.set('token', data.token);
      setVisible(false)
    } catch (error: any) {
      toast.error(error.response.data.message, { duration: 6000 })
      setLoading(false)
    }

  }

  const handleLogin = async (values: AuthFormValues) => {
    try {
      setLoading(true)
      const data = await makeRequest('post', '/api/auth/login', values)
      toast.success('Te damos la bienvenida', { duration: 6000 })
      setLoading(false)
      replace('/account')
      setUser(data)
      Cookies.set('token', data.token);
      setVisible(false)
    } catch (error: any) {
      toast.error(error.response.data.message, { duration: 6000 })
      setLoading(false)
    }
  }

  const handleResetPassword = async (values: AuthFormValues) => {
    try {
      setLoading(true)
      await makeRequest('post', '/api/auth/recover', values)
      toast.success('Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.', { duration: 6000 })
      setLoading(false)
      setType('login')
    } catch (error: any) {
      toast.error(error.response.data.message, { duration: 6000 })
      setLoading(false)
    }
  }

  const onSubmit = async (values: any) => {
    if (type === 'login') {
      await handleLogin(values);
    } else if (type === 'sign-up') {
      await handleSignUp(values);
    } else if (type === 'forgot-password') {
      await handleResetPassword(values);
    }
  }

  return (
    <div className={styles.auth}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Logo" fill />
        </div>
        <h2>{renderHeaderMessage()}</h2>

        {type === 'forgot-password' && (
          <span>
            Escribe el correo electrónico que utilizaste cuando te registraste. Te enviaremos las instrucciones
            para recuperar tu contraseña. (Si no ves el correo, revisa tu SPAM).
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {
          type === 'sign-up' &&
          <Input errors={errors} register={register} required name='name' label="Nombre(s) y apellido(s)" />
        }
        <Input errors={errors} register={register} required name='email' label="Correo electrónico" type="email" />
        {
          (type === 'sign-up' || type === 'login') &&
          <Input errors={errors} register={register} required name='password' label="Contraseña" type="password" />
        }
        <div className={styles.buttons}>
          {type === 'login' && (
            <>
              <button type="submit" disabled={loading} className="btn btn-black btn-block">
                Iniciar sesión
              </button>
              <button onClick={() => handleTypeChange('sign-up')} className="btn btn-ghost btn-block">
                ¿No tienes cuenta? Crea una ahora
              </button>
              <button onClick={() => handleTypeChange('forgot-password')} className="btn btn-ghost btn-block">
                ¿Olvidaste tu contraseña?
              </button>
            </>
          )}

          {type === 'sign-up' && (
            <>
              <button type="submit" disabled={loading} className="btn btn-black btn-block">
                Crear cuenta
              </button>
              <button onClick={() => handleTypeChange('login')} className="btn btn-ghost btn-block">
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </>
          )}

          {type === 'forgot-password' && (
            <>
              <button type="submit" disabled={loading} className="btn btn-black btn-block">
                Enviar
              </button>
              <button onClick={() => handleTypeChange('login')} className="btn btn-ghost btn-block">
                Regresar
              </button>
            </>
          )}
        </div>
      </form>


    </div>
  );
};

export default Auth;
