// import { useEffect, useRef, useState } from 'react'
// import { api } from '@/api_config/api'
// import { useForm } from 'react-hook-form';
// import TextArea from '../../ui/TextArea';
// // @ts-ignore
// import { Upload } from '../Upload';
// import Modal from '../../ui/Modal';
// import toast from 'react-hot-toast';
// import { SubCategory } from '@/interfaces/SubCategory';
// import 'react-image-crop/src/ReactCrop.scss'
// import ReactCrop, { Crop } from 'react-image-crop'
// import Select from '@/components/ui/Select';
// import Input from '@/components/ui/Input';
// import useFileUpload from '@/hooks/useFileUpload';
// import { makeRequest } from '@/utils/makeRequest';

import useFileUpload from "@/hooks/useFileUpload"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import Input from "../common/Input"
import Modal from "../common/Modal"
import { makeRequest } from "@/utils/makeRequest"
import { useForm } from "react-hook-form"
import TextArea from "../common/TextArea"
import Select from "../common/Select"

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddProduct = ({ visible, setVisible, onOk }: Props) => {
  const [images, setImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, control, resetField, reset, formState: { errors } } = useForm();
  const subscribeToHasDiscount = register('hasDiscount')
  const subscribeToIsCustomizable = register('isCustomizable')

  const [hasDiscount, setHasDiscount] = useState(false)

  const [image, setImage] = useState('')

  const [crop, setCrop] = useState<Crop>()

  const imageRef = useRef<any>()

  const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await handleFileUpload(file);
      setImage(data as string)
    }
  };

  const onSubmit = async (values: any) => {

    if (images.length === 0) return toast.error('Elige al menos 1 imagen')
    setSaving(true)
    try {
      const product = {
        ...values,
        attributes: values.attributes?.map((attribute: any) => attribute?.value),
        subCategories: values.subCategories?.map((sub: any) => sub.value),
        images,
        previewImage: image,
        crop,
      }
      await makeRequest('post', '/api/products', product)
      toast.success('Producto agregado')
      setSaving(false)
      onOk && onOk()
      reset()
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message)
      setSaving(false)
    }
  }

  return (
    <Modal
      loadingState={saving || uploading}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
      }}
      title='Nuevo producto'
      onClose={() => {
        setVisible(false)
      }}
      visible={visible}
    >
      <div className='detailPage'>
        <Input
          register={register}
          placeholder='Nombre'
          name='name'
          errors={errors}
          label='Nombre del producto'
          required
        />
        <TextArea
          register={register}
          placeholder='Descripción'
          name='description'
          errors={errors}
          label='Descripción del producto'
          required
        />
        <Input
          register={register}
          label='Palabras clave'
          placeholder=''
          name='keywords'
        />
        <Input
          type='number'
          register={register}
          placeholder='Precio'
          name='price'
          errors={errors}
          label='Precio'
          required
        />
        <input
          {...subscribeToHasDiscount}
          onChange={(e) => {
            setHasDiscount(e.target.checked)
          }}
          type="checkbox"
          name="hasDiscount"
          id="hasDiscount"
        />
        <label htmlFor="hasDiscount">Tiene descuento</label>
        {
          hasDiscount &&
          <div className="group">
            <Input
              required
              register={register}
              placeholder='Valor del descuento'
              name='discountValue'
              errors={errors}
              label='Valor del descuento'
            />
          </div>
        }
        <div className="group">
          <input {...register('active')} type="checkbox" name="active" id="active" />
          <label htmlFor="active">Activo</label>
        </div>
        <div className="group">
          <input
            {...subscribeToIsCustomizable}
            onChange={() => {
              resetField('attributes')
            }}
            type="checkbox"
            name="isCustomizable"
            id="isCustomizable"
          />
          <label htmlFor="isCustomizable">Es personalizable</label>
        </div>
        <Upload
          url={`/api/files/multiple`}
          images={images}
          setImages={setImages}
        />
        <br />
        <br />
        <div className='group'>
          <label htmlFor="">Cargar imagen para vista previa</label>
          <input
            onChange={onFileChange}
            ref={imageRef}
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
          />
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center' }}>
            {
              image !== '' &&
              <div
                className='imagePreview'>
                <button onClick={() => imageRef.current.click()} className='btn delete'>Elegir otra imagen</button>
                <ReactCrop
                  ruleOfThirds
                  maxWidth={550}
                  aspect={1} crop={crop} onChange={c => setCrop(c)}>
                  <div className='crop-wrapper'>
                    <img src={image} />
                    <span
                      style={{
                        //@ts-ignore
                        top: crop?.y
                      }}
                      className='guide'>Arriba</span>
                    <span
                      style={{
                        //@ts-ignore
                        top: crop?.y + ((crop?.height - 20) / 2)
                      }}
                      className='guide'>Enmedio</span>
                    <span
                      style={{
                        //@ts-ignore
                        top: crop?.y + crop?.height - 20
                      }}
                      className='guide'>Abajo</span>
                  </div>
                </ReactCrop>
              </div>
            }
            {
              image === '' &&
              <div onClick={() => { imageRef.current.click() }} style={
                {
                  width: 150,
                  height: 150,
                  border: '2px dashed #cdcdcd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 14,
                  cursor: 'pointer',
                  marginLeft: image ? 20 : 0,
                  flexShrink: 0
                }
              }>
                <span>
                  Elegir imagen
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddProduct