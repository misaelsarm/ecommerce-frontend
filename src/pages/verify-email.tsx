import React, { useState } from 'react'
import styles from '@/styles/VerifyEmail.module.scss'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { makeRequest } from '@/utils/makeRequest'

interface Props {
  valid: boolean
  errorCode: number
}

const VerifyEmail = ({ errorCode }: Props) => {

  return (
    <div className={styles.verify}>
      <div className={styles.logo}>
        <Image alt='' fill src='/logo.png' />
      </div>
      {
        errorCode ? <div className={`${styles.icon} ${styles.red}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>

        </div> : <div className={`${styles.icon} ${styles.green}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      }
      <span>
        {
          errorCode ? 'Este link de verificación no es válido o ya expiró.' : 'Tu correo electrónico se ha verificado. Ahora puedes iniciar sesión con tu nueva cuenta de Norday.'
        }
      </span>
      {
        errorCode ? <button className='btn btn-black'>Ir a Inicio</button> : <button className='btn btn-black'>Iniciar sesión</button>
      }
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query, params }) => {

  let isValid

  let errorCode = null;

  try {
    const data = await makeRequest('get', `/api/auth/verify-email?token=${query.token}`)

    isValid = data.valid

  } catch (error: any) {
    // Set errorCode based on the type of error (you can customize based on your needs)
    if (error.response?.status === 401) {
      errorCode = 401; // Unauthorized
    } else if (error.response?.status === 500) {
      errorCode = 500; // Internal Server Error
    } else {
      errorCode = 400; // General Error
    }
  }

  // Handle redirection or returning error code
  if (errorCode) {
    return {
      props: {
        errorCode, // Pass the error code to the frontend to render an error page
      },
    };
  }

  return {
    props: {
      valid: isValid
    }
  }
}


export default VerifyEmail