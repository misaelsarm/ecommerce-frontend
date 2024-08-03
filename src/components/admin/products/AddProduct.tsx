import { useState } from "react"
import toast from "react-hot-toast"
import Modal from "../../common/Modal"
import { makeRequest } from "@/utils/makeRequest"
import { useForm } from "react-hook-form"
import ProductFields from "./ProductFields"
import Input from "@/components/common/Input"
import TextArea from "@/components/common/TextArea"
import Checkbox from "@/components/common/Checkbox"
import Select from "@/components/common/Select"
import { Sortable } from "../Sortable"

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddProduct = ({ visible, setVisible, onOk }: Props) => {

  const [saving, setSaving] = useState(false)

  const [items, setItems] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

  const [hasDiscount, setHasDiscount] = useState(false)

  const [isCustomizable, setIsCustomizable] = useState(false)

  const { register, handleSubmit, control, resetField, reset, formState: { errors } } = useForm();

  const [images, setImages] = useState([])

  //const { handleFileUpload, uploading } = useFileUpload();

  const [uploading, setUploading] = useState(false)

  const onSubmit = async (values: any) => {

    if (images.length === 0) return toast.error('Elige al menos 1 imagen')
    setSaving(true)
    try {
      const product = {
        ...values,
        attributes: values.attributes?.map((attribute: any) => attribute?.value),
        subCategories: values.subCategories?.map((sub: any) => sub.value),
        images
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
      loadingState={saving /* || uploading */}
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
      <>
        <Input
          register={register}
          name='name'
          errors={errors}
          label='Nombre del producto'
          required
        />
        <TextArea
          register={register}
          name='description'
          errors={errors}
          label='Descripción del producto'
          required
        />
        <Input
          register={register}
          label='Palabras clave'
          name='keywords'
        />
        <Input
          type='number'
          register={register}
          name='price'
          errors={errors}
          label='Precio'
          required
        />
        <Checkbox
          label='Tiene descuento'
          id='hasDiscount'
          onChange={(e) => {
            setHasDiscount(e.target.checked)
          }}
          name='hasDiscount'
        />
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
        <Checkbox
          label='Activo'
          id='active'
          name='active'
        />
        <Checkbox
          label='Es personalizable'
          id='isCustomizable'
          name='isCustomizable'
          onChange={(e) => {
            setIsCustomizable(e.target.checked)
          }}
        />
        {
          isCustomizable && <Select
            control={control}
            errors={errors}
            required
            options={[]}
            name="attributes"
            label="Atributos y características del producto"
            isMulti
          />
        }
        <Sortable
          label='Agregar imagenes del producto'
          items={[]}
          setItems={setItems}
          uploading={uploading}
        />
      </>
    </Modal>
  )
}

export default AddProduct