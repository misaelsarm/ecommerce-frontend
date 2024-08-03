import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import useFileUpload from '@/hooks/useFileUpload';
import { makeRequest } from '@/utils/makeRequest';

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddCollection = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await handleFileUpload(file);
      setImage(data as string)
    }
  };

  const imageRef = useRef<any>()
  const [image, setImage] = useState('')
  const [banner, setBanner] = useState('')
  const [saving, setSaving] = useState(false)

  const [current, setCurrent] = useState(currentEditing)

  useEffect(() => {
    setCurrent(currentEditing)
    setImage(currentEditing.image || '')
    setBanner(currentEditing.banner || '')
    reset(currentEditing)
  }, [currentEditing, reset])

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      const collection = {
        ...data,
        image,
        banner
      }
      if (current.id) {
        // await api.put(`/api/categories/${current.id}`, collection, {
        //   headers: {
        //     "x-access-token": Cookies.get('token')
        //   }
        // })
        await makeRequest('put', `/api/categories/${current.id}`, collection)
        toast.success('Categoría actualizada')
      } else {
        // await api.post('/api/categories', collection, {
        //   headers: {
        //     "x-access-token": Cookies.get('token')
        //   }
        // })
        await makeRequest('post', '/api/categories', collection)
        toast.success('Categoría creada')
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
      loadingState={saving || uploading}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
      }}
      title='Nueva Categoría'
      onClose={() => {
        setVisible(false)
      }}
      visible={visible}
    >
      <div className='detailPage'>
        <div className="group">
          <Input
            register={register}
            label='Nombre de Categoría'
            placeholder=''
            name='name'
            errors={errors}
            required
          />
        </div>
        <div className="group">
          <TextArea
            register={register}
            label='Descripción de Categoría'
            placeholder=''
            name='description'
            errors={errors}
            required
          />
        </div>
        <div className="group">
          <Input
            register={register}
            label='Palabras clave'
            placeholder=''
            name='keywords'
            errors={errors}
            required
          />
        </div>
        <div className="group">
          <input {...register('active')} type="checkbox" name="active" id="active" />
          <label htmlFor="active">Activa</label>
        </div>
        <div className='group'>
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
      </div>
    </Modal>
  )
}

export default AddCollection