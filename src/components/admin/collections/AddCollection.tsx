import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { makeRequest } from '@/utils/makeRequest';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal/Modal';
import Input from '@/components/common/Input/Input';
import TextArea from '@/components/common/TextArea/TextArea';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import Select from '@/components/common/Select/Select';
import { CollectionInterface, ProductInterface } from '@/interfaces';

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddCollection = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const [collections, setCollections] = useState<any[]>([])

  const [products, setProducts] = useState([])

  //const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const data = await handleFileUpload(file);
    //   setImage(data as string)
    // }
  };

  async function fetchData() {
    try {

      const data = await makeRequest('get', `/api/collections?active=true`, {}, {
        headers: {
          //"x-access-token": token
          //"x-location": "admin"
        }
      })
      
      const productData = await makeRequest('get', `/api/products?active=true`, {}, {
        headers: {
          //"x-access-token": token
          //"x-location": "admin"
        }
      })

      setCollections(data.collections.map((col: CollectionInterface) => ({
        label: col.name,
        value: col._id
      })))

      setProducts(productData.products.map((prod: ProductInterface) => ({
        label: prod.name,
        value: prod._id
      })))

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  const imageRef = useRef<any>()

  const [image, setImage] = useState('')

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  const resetForm = () => {
    reset()
    setImage('')
  }

  const onSubmit = async (values: any) => {
    try {
      setSaving(true)
      const collection = {
        ...values,
        parentCollection: values.parentCollection?.value,
        products: values.products.map((prod:any)=>prod.value),
        image,
      }

      await makeRequest('post', '/api/collections', collection)

      resetForm()
      setSaving(false)
      setVisible(false)
      onOk && onOk()
    } catch (error: any) {
      console.log({ error })
      toast.error(error?.response?.data?.message || 'Error al añadir la colección.' + error)
      setSaving(false)
    }
  }

  return (
    <Modal
      loadingState={saving/*  || uploading */}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
        resetForm()
      }}
      title='Nueva colección'
      onClose={() => {
        setVisible(false)
        resetForm()
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
          options={collections}
          name="parentCollection"
          label="Colección agrupadora"
        />
        <Select
          control={control}
          options={products}
          name="products"
          label="Añadir productos a la colección"
          isMulti
        />
        <Input
          register={register}
          label='Palabras clave'
          placeholder=''
          name='keywords'
        />
        <Checkbox
          label='Activa'
          id='active'
          name='active'
          register={register}
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