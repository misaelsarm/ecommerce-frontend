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
import Input from "../../common/Input"
import Modal from "../../common/Modal"
import { makeRequest } from "@/utils/makeRequest"
import { useForm } from "react-hook-form"
import TextArea from "../../common/TextArea"
import Select from "../../common/Select"
import ProductFields from "./ProductFields"

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

  // const [crop, setCrop] = useState<Crop>()

  const imageRef = useRef<any>()

  //const { handleFileUpload, uploading } = useFileUpload();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const data = await handleFileUpload(file);
    //   setImage(data as string)
    // }
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
      //loadingState={saving || uploading}
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
      <ProductFields register={register} errors={errors} />
    </Modal>
  )
}

export default AddProduct