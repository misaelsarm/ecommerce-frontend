import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { makeRequest } from "@/utils/makeRequest"
import { useForm } from "react-hook-form"
import { AttributeInterface, CollectionInterface, ProductInterface } from "@/interfaces"
import { Checkbox, Input, Modal, Select, Sortable, TextArea } from "@/components/common"
import { useRouter } from "next/router"
import { ModalBaseProps } from "@/interfaces/ModalBaseProps"
import { generateSlug } from "@/utils/generateSlug"
import { CustomFieldForm } from "../CustomFieldForm"

interface Props extends ModalBaseProps {
  //only pass product if editing
  product?: ProductInterface
}

export const ProductModal = ({ visible, setVisible, title, product }: Props) => {

  const [collections, setCollections] = useState<any[]>([])

  const [attributes, setAttributes] = useState<any[]>([])

  const { replace } = useRouter()

  const fetchCollections = async () => {
    if (collections.length === 0) {
      try {
        const data = await makeRequest('get', '/api/public/collections?active=true')
        setCollections(data.collections.map((item: CollectionInterface) => ({ value: item._id, label: item.name })))
      } catch (error: any) {
        toast.error(error.response.data.message)
        console.log({ error })
      }
    }
  }

  const fetchAttributes = async () => {
    if (attributes.length === 0) {
      try {
        const data = await makeRequest('get', '/api/admin/attributes?active=true')
        setAttributes(data.attributes.map((item: AttributeInterface) => ({ value: item._id, label: item.shortName })))
      } catch (error: any) {
        toast.error(error.response.data.message)
        console.log({ error })
      }
    }

  }

  // Fetch collections when the modal is opened and prevent fetching if already fetched
  useEffect(() => {
    if (visible) {
      fetchCollections()
      if (product?.isCustomizable) {
        fetchAttributes()
      }
    }
  }, [visible, product?.isCustomizable])

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  const [uploading, setUploading] = useState(false)

  // Initialize UI state based on the product's existing values when editing, 
  //to conditionally render sections like discount, customization, inventory, and images
  const [hasDiscount, setHasDiscount] = useState(product?.discount?.hasDiscount || false)

  const [isCustomizable, setIsCustomizable] = useState(product?.isCustomizable || false)

  const [isTracked, setIsTracked] = useState(product?.inventory?.isTracked || false)

  const [images, setImages] = useState(product?.images || [])

  useEffect(() => {
    if (product && visible) {
      reset({
        name: product.name,
        description: product.description,
        keywords: product.keywords,
        price: product.price,
        isCustomizable: product.isCustomizable,
        attributes: product.attributes.map(att => (
          {
            label: att.shortName,
            value: att._id
          }
        )),
        collections: product.collections.map(col => (
          {
            label: col.name,
            value: col._id
          }
        )),
        active: product.active,
        soldOut: product.soldOut,
        hasDiscount: product.discount?.hasDiscount,
        discountType: product.discount?.discountType,
        discountValue: product.discount?.discountValue,
        isTracked: product.inventory?.isTracked,
        availableQuantity: product.inventory?.availableQuantity
      })
    }
    //reset product
  }, [product, visible])

  const resetForm = () => {
    if (!product) {
      reset()
      setHasDiscount(false)
      setIsCustomizable(false)
      setIsTracked(false)
      setImages([])
    }
  }


  const onSubmit = async (values: any) => {

    if (images.length === 0) return toast.error('Elige al menos 1 imagen')
    try {
      setSaving(true)
      const code = generateSlug(values.name)
      const payload = {
        attributes: values.attributes?.map((attribute: any) => attribute?.value),
        collections: values.collections?.map((col: any) => col.value),
        name: values.name,
        code,
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
      if (product) {
        await makeRequest('put', `/api/admin/products/${product._id}`, payload)
        toast.success('Producto actualizado')
      } else {
        await makeRequest('post', '/api/admin/products', payload)
        toast.success('Producto agregado')
      }

      setSaving(false)
      replace(`/admin/products/${code}`)
      resetForm()
      setVisible(false)
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Error al añadir producto. ' + error)
      setSaving(false)
    }
  }

  // const fields = [
  //   {
  //     component: 'input',
  //     name: 'name',
  //     label: 'Nombre del producto',
  //     required: true,
  //     register,
  //     errors,
  //     visible: true
  //   },
  //   {
  //     component: 'text-area',
  //     register,
  //     name: 'description',
  //     errors,
  //     label: 'Descripción del producto',
  //     required: true,
  //     visible: true
  //   },
  //   {
  //     component: 'input',
  //     register,
  //     name: 'keywords',
  //     label: 'Palabras clave',
  //     visible: true
  //   },
  //   {
  //     component: 'input',
  //     type: 'number',
  //     register,
  //     errors,
  //     required: true,
  //     name: 'price',
  //     label: 'Precio',
  //     visible: true
  //   },
  //   {
  //     component: 'select',
  //     control,
  //     errors,
  //     required: true,
  //     name: 'collections',
  //     label: 'Colecciones',
  //     options: collections,
  //     visible: true,
  //     isMulti: true
  //   },
  //   {
  //     component: 'checkbox',
  //     register,
  //     name: 'hasDiscount',
  //     id: 'hasDiscount',
  //     label: 'Tiene descuento',
  //     onChange: (e: any) => {
  //       setHasDiscount(e.target.checked)
  //     },
  //     visible: true
  //   },
  //   {
  //     component: 'input',
  //     type: 'number',
  //     register,
  //     name: 'discountValue',
  //     label: 'Valor del descuento',
  //     visible: hasDiscount
  //   },
  //   {
  //     component: 'checkbox',
  //     register,
  //     name: 'isCustomizable',
  //     id: 'isCustomizable',
  //     label: 'Es personalizable',
  //     onChange: (e: any) => {
  //       setIsCustomizable(e.target.checked)
  //     },
  //     visible: true
  //   },
  //   {
  //     component: 'select',
  //     register,
  //     name: 'attributes',
  //     label: 'Atributos y características del producto',
  //     visible: isCustomizable,
  //     isMulti: true
  //   },
  // ]

  return (
    <Modal
      loadingState={saving || uploading}
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
      {
        // fields.map(field => {
        //   if (field.visible) {
        //     if (field.component === 'input') {
        //       return <Input {...field} />
        //     }
        //     if (field.component === 'text-area') {
        //       return <TextArea {...field} />
        //     }
        //     if (field.component === 'select') {
        //       return <Select {...field} />
        //     }
        //     if (field.component === 'checkbox') {
        //       return <Checkbox {...field} />
        //     }
        //   }
        // })
      }
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
            if (e.target.checked) {
              fetchAttributes()
            }
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
          setUploading={setUploading}
          folder="products"
        />
        <br />
        <br />
        <CustomFieldForm />

      </>
    </Modal>
  )
}