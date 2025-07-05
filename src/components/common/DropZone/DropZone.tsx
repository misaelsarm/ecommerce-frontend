import React, { useEffect, useRef, useState } from 'react'
import styles from './Dropzone.module.scss'
import Image from "next/image"
import { FieldErrorsImpl, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import useFileUpload from '@/hooks/useFileUpload'

interface Props {
  width?: string
  height?: string
  label?: string
  register?: UseFormRegister<FieldValues>
  name: string
  setValue?: UseFormSetValue<FieldValues>
  required?: boolean
  errors?: FieldErrorsImpl<{
    [x: string]: any;
  }>
  defaultValue?: string
  folder: string
}

export const DropZone = ({ width = '100%', height = '300px', label, register, name, setValue, required, defaultValue, folder, errors }: Props) => {

  useEffect(() => {
    if (defaultValue) {
      if (setValue) {
        setValue(name, defaultValue)
      }
      setImageUrl(defaultValue)
    }
  }, [])

  const ref = useRef()

  const [imageUrl, setImageUrl] = useState('')

  const { handleFileUpload, uploading } = useFileUpload({ folder });

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const data = await handleFileUpload(file) as string
      setImageUrl(data)
      if (setValue) {
        setValue(name, data); // Set the image URL in the form state
      }
    }
  };

  return (
    <div className={styles.dropZoneWrapper}>
      <input
        {...register && {
          ...register(name, {
            required: {
              value: required || false,
              message: 'Requerido'
            }
          })
        }}
        type="file"
        accept='image/*'
        style={{
          display: 'none'
        }}
        //@ts-ignore
        ref={ref}
        onChange={handleFileChange} // Handle file change
      />
      {
        label &&
        <span>{label}</span>
      }
      {
        uploading && <div className='d-flex align-center justify-between mb-20'>
          <h3>Subiendo imagen. Por favor espera...</h3>
          <div className='loader'></div>
        </div>
      }
      {
        imageUrl === '' ? <div
          onClick={() => {
            //@ts-ignore
            ref.current.click()
          }}
          style={{
            width,
            height
          }}
          className={styles.dropZone}>
          <div className={styles.icons}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <span>Subir imagen</span>
          </div>

        </div> :
          <div
            onClick={() => {
              //@ts-ignore
              ref.current.click()
            }}
            style={{
              width,
              height
            }}
            className={styles.dropZonePreview}>

            <Image alt='' src={imageUrl} fill sizes="100vw" />

            <div className={styles.remove}>
              <button className='btn btn-primary'>Elegir otra imagen</button>
            </div>
          </div>
      }
      {
        errors && errors[name] && <span className='error'>
          {/* @ts-ignore */}
          {errors[name].message}
        </span>
      }
    </div>
  );
}