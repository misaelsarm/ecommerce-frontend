import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { makeRequest } from '@/utils/makeRequest';
import toast from 'react-hot-toast';
import { CollectionInterface } from '@/interfaces';
import { Checkbox, DropZone, Input, Modal, Select, TextArea } from '@/components/common';
import { ModalBaseProps } from '@/interfaces/ModalBaseProps';
import { useRouter } from 'next/router';
import { generateSlug } from '@/utils/generateSlug';

interface Props extends ModalBaseProps {
  collection: CollectionInterface
}

export const CollectionModal = ({ visible, setVisible, title, collection }: Props) => {

  const { register, handleSubmit, reset, control, formState: { errors }, setValue } = useForm();
  const [saving, setSaving] = useState(false)
  const [collections, setCollections] = useState<any[]>([])

  const { replace } = useRouter()

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
      const code = generateSlug(values.name)

      const payload = {
        name: values.name,
        description: values.description,
        parents: values.parents?.map((item: any) => item.value),
        keywords: values.keywords,
        color: values.color,
        image: values.image,
        active: values.active,
        highlight: values.highlight,
        code
      }

      if (collection) {
        await makeRequest('put', `/api/admin/collections/${collection._id}`, payload)
        toast.success('Colección actualizada')
      } else {
        await makeRequest('post', '/api/admin/collections', payload)
        toast.success('Colección creada')
      }
      replace(`/admin/collections/${code}`)
      resetForm()
      setSaving(false)
      setVisible(false)
    } catch (error: any) {
      console.log({ error })
      toast.error(error?.response?.data?.message || 'Error al añadir la colección.' + error)
      setSaving(false)
    }
  }

  useEffect(() => {
    if (visible && collection) {
      reset({
        ...collection,
        name: collection.name,
        description: collection.description,
        keywords: collection.keywords,
        parentCollection: {
          label: collection.parentCollection?.name,
          value: collection.parentCollection?._id
        },
        products: collection.products?.map(prod => ({
          label: prod?.name,
          value: prod?._id
        })),
        active: collection.active,
      })
    }
  }, [visible, collection])

  return (
    <Modal
      loadingState={saving}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
        resetForm()
      }}
      title={title}
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
          defaultValue={collection?.image || undefined}
        />
      </>
    </Modal >
  )
}