import { useEffect, useState } from "react"
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
import { AttributeInterface, CollectionInterface } from "@/interfaces"
import { api } from "@/api_config/api"
import Cookies from "js-cookie"

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddProduct = ({ visible, setVisible, onOk }: Props) => {

  const [collections, setCollections] = useState<any[]>([])

  const [attributes, setAttributes] = useState<any[]>([])

  useEffect(() => {
    if (visible) {
      console.log('visible')
      async function fetchData() {
        try {

          const { data } = await api.get(`/api/collections`, {
            headers: {
              //"x-access-token": token
              //"x-location": "admin"
            }
          })
          const { data: attributesData } = await api.get(`/api/attributes`, {
            headers: {
              "x-access-token": Cookies.get('token')
              //"x-location": "admin"
            }
          })
          setCollections(data.collections.map((col: CollectionInterface) => ({
            label: col.name,
            value: col._id
          })))
          setAttributes(attributesData.attributes.map((att: AttributeInterface) => ({
            label: att.shortName,
            value: att._id
          })))
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Error')
        }
      }
      fetchData();
    }
  }, [visible]);

  const { register, handleSubmit, control, resetField, reset, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  const [hasDiscount, setHasDiscount] = useState(false)

  const [isCustomizable, setIsCustomizable] = useState(false)

  const [isTracked, setIsTracked] = useState(false)

  const [images, setImages] = useState([])

  const [uploading, setUploading] = useState(false)

  const resetForm = () => {
    reset()
    setHasDiscount(false)
    setIsCustomizable(false)
    setIsTracked(false)
    setImages([])
  }

  //const { handleFileUpload, uploading } = useFileUpload();

  const onSubmit = async (values: any) => {
    console.log({ values })

    //if (images.length === 0) return toast.error('Elige al menos 1 imagen')

    //setSaving(true)

    try {
      const product = {
        attributes: values.attributes?.map((attribute: any) => attribute?.value),
        collections: values.collections?.map((col: any) => col.value),
        name: values.name,
        description: values.description,
        price: values.price,
        images,
        active: values.active,
        soldOut: values.soldOut,
        discount: {
          hasDiscount: values.hasDiscount,
          discountType: values.discountType,
          discountValue: values.discountValue
        },
        isCustomizable: values.isCustomizable,
        keywords: values.keywords,
        inventory: {
          isTracked: values.isTracked,
          availableQuantity: values.availableQuantity
        },
      }
      //return console.log({ product })
      await makeRequest('post', '/api/products', product)
      toast.success('Producto agregado')
      setSaving(false)
      onOk && onOk()
      reset()
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Error')
      setSaving(false)
    }
  }

  return (
    <Modal
      loadingState={saving /* || uploading */}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
        resetForm()
      }}
      title='Nuevo producto'
      onClose={() => {
        setVisible(false)
        resetForm()
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
        <Select
          control={control}
          errors={errors}
          required
          options={collections}
          name="collections"
          label="Colecciones"
          isMulti
        />
        <Checkbox
          register={register}
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
          register={register}
          label='Activo'
          id='active'
          name='active'
        />
        <Checkbox
          register={register}
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
            options={attributes}
            name="attributes"
            label="Atributos y características del producto"
            isMulti
          />
        }
        <Checkbox
          register={register}
          label='Realizar seguimiento de inventario'
          id='isTracked'
          name='isTracked'
          onChange={(e) => {
            setIsTracked(e.target.checked)
          }}
        />
        {
          isTracked &&
          <Input
            type='number'
            register={register}
            name='availableQuantity'
            errors={errors}
            label='Cantidad disponible'
            required
          />
        }
        <Sortable
          label='Agregar imagenes del producto'
          items={images}
          setItems={setImages}
          uploading={uploading}
        />
      </>
    </Modal>
  )
}

export default AddProduct