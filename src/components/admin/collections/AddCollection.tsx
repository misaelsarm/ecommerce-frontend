import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import useFileUpload from '@/hooks/useFileUpload';
import { makeRequest } from '@/utils/makeRequest';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import Checkbox from '@/components/common/Checkbox';
import Select from '@/components/common/Select';

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddCollection = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  //const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const data = await handleFileUpload(file);
    //   setImage(data as string)
    // }
  };

  const imageRef = useRef<any>()
  const [image, setImage] = useState('')
  const [banner, setBanner] = useState('')
  const [saving, setSaving] = useState(false)

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      const collection = {
        ...data,
        image,
        banner
      }
      
      reset()
      setSaving(false)
      setVisible(false)
      onOk && onOk()
    } catch (error: any) {
      console.log({ error })
      toast.error(error.response.data.message)
      setSaving(false)
    }
  }

  return (
    <Modal
      loadingState={saving/*  || uploading */}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
      }}
      title='Nueva colección'
      onClose={() => {
        setVisible(false)
      }}
      visible={visible}
    >
      <>
        <Input
          register={register}
          label='Nombre'
          placeholder=''
          name='name'
          errors={errors}
          required
        />
        <TextArea
          register={register}
          label='Descripción'
          placeholder=''
          name='description'
          errors={errors}
          required
        />
        <Select
          control={control}
          options={[]}
          name="parentCollection"
          label="Colección padre"
        />
        <Input
          register={register}
          label='Palabras clave'
          placeholder=''
          name='keywords'
          errors={errors}
          required
        />
        <Checkbox
          label='Activa'
          id='active'
          name='active'
        />

        <div className="input-group">
          <label htmlFor="">Subir imagen principal</label>
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
                <img src={image} alt='' />
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
      </>
    </Modal >
  )
}

export default AddCollection