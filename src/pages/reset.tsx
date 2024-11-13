import React, { useState } from 'react'
import styles from '@/styles/Reset.module.scss'
import Image from 'next/image'
import Input from '@/components/common/Input'
import { useForm } from 'react-hook-form'
import { makeRequest } from '@/utils/makeRequest'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Link from 'next/link'

const ResetPage = () => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const { query } = useRouter()

  const token = query.token

  const [loading, setLoading] = useState(false)

  const [ok, setOk] = useState(true)

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      await makeRequest('post', `/api/auth/reset/${token}`, values)
      toast.success('La contraseña se ha actualizado.')
      setOk(true)
      setLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message)
      setOk(false)
      setLoading(false)
    }
  }

  return (
    <div className={styles.reset}>
      <div className={styles.logo}>
        <Image alt='' fill src='/logo.png' />
      </div>
      <h2>Restablecer contraseña</h2>
      {
        ok ?
          <>
            <div className={`${styles.icon} ${styles.green}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div className={styles.fields}>

              <span>Tu contraseña ha cambiado de manera exitosa.</span>
              <Link href='/' className='btn btn-black'>Ir a Inicio</Link>
            </div>
          </>
          : <form onSubmit={handleSubmit(onSubmit)} className={styles.fields}>
            <Input
              register={register}
              name='password'
              label='Nueva contraseña'
              type='password'
              required
              errors={errors}
            />
            <Input
              register={register}
              name='confirm_password'
              label='Repetir contraseña'
              type='password'
              required
              errors={errors}
              validate={
                (val: string) => {
                  if (watch('password') != val) {
                    return "Tus contraseñas no coinciden";
                  }
                }
              }
            />
            <button disabled={loading} className='btn btn-black btn-block'>Aceptar</button>
          </form>
      }
    </div>
  )
}

export default ResetPage