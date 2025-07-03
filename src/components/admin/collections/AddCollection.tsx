import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { makeRequest } from '@/utils/makeRequest';
import toast from 'react-hot-toast';
import { CollectionInterface } from '@/interfaces';
import Modal from '@/components/common/Modal/Modal';
import Input from '@/components/common/Input/Input';
import TextArea from '@/components/common/TextArea/TextArea';
import Select from '@/components/common/Select/Select';
import Checkbox from '@/components/common/Checkbox/Checkbox';
import DropZone from '@/components/common/DropZone/DropZone';


interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddCollection = ({ visible, setVisible, onOk }: Props) => {

  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, control, formState: { errors }, setValue } = useForm();

  const [collections, setCollections] = useState<any[]>([])

  async function fetchData() {
    try {

      const data = await makeRequest('get', `/api/public/collections?active=true`)

      setCollections(data.collections.map((col: CollectionInterface) => ({
        label: col.name,
        value: col._id
      })))

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  useEffect(() => {
    if (visible && collections.length === 0) {
      fetchData();
    }
  }, [visible]);

  const resetForm = () => {
    reset()
  }

  const onSubmit = async (values: any) => {
    try {
      setSaving(true)
      const collection = {

        name: values.name,
        description: values.description,
        parents: values.parents?.map((item: any) => item.value),
        keywords: values.keywords,
        color: values.color,
        image: values.image,
        banner: values.banner,
        active: values.active,
        highlight: values.highlight
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
          name="parents"
          label="Colecciones agrupadoras"
          isMulti
        />
        <Input
          register={register}
          label='Palabras clave'
          placeholder=''
          name='keywords'
        />
        <Checkbox
          register={register}
          label='Destacar'
          id='highlight'
          name='highlight'
        />
        <Checkbox
          label='Activa'
          id='active'
          name='active'
          register={register}
        />
        <DropZone
          folder='collections/images'
          label='Subir imagen principal'
          name='image'
          register={register}
          setValue={setValue}
          required
          errors={errors}
          width='100%'
          height='300px'
        />
      </>
    </Modal >
  )
}

export default AddCollection