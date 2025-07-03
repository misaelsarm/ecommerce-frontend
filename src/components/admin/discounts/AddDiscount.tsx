import Checkbox from "@/components/common/Checkbox/Checkbox";
import DatePicker from "@/components/common/DatePicker/DatePicker";
import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal/Modal";
import Select from "@/components/common/Select/Select";
import { CollectionInterface, ProductInterface } from "@/interfaces";
import { discountLimitBy, discountTypes } from "@/utils/catalogs";
import { makeRequest } from "@/utils/makeRequest";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddDiscount = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  const [limitBy, setLimitBy] = useState('')

  const [discountType, setDiscountType] = useState('')

  const [products, setProducts] = useState<ProductInterface[]>([])

  const [limited, setLimited] = useState(false)

  const [collections, setCollections] = useState<CollectionInterface[]>([])

  const resetForm = () => {
    reset()
    setLimitBy('')
    setDiscountType('')
    setLimited(false)
  }

  const fetchProducts = async () => {
    try {
      const data = await makeRequest('get', '/api/public/products?active=true')
      setProducts(data.products)
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.log({ error })
    }
  }

  const fetchCollections = async () => {
    try {
      const data = await makeRequest('get', '/api/public/collections?active=true')
      setCollections(data.collections)
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.log({ error })
    }
  }

  const onSubmit = async (values: any) => {

    try {

      let validProducts: string[] = []

      let validCollections: string[] = []

      let foundProducts = []

      if (limitBy === 'collection') {

        let selectedCollections: string[] = values.applicableCollections?.map((cat: any) => cat.value)

        for (const product of products) {

          for (const col of product.collections) {
            if (selectedCollections.includes(col._id)) {
              foundProducts.push(product._id)
            }
          }
        }

        validProducts = foundProducts
        validCollections = selectedCollections

      } else {
        validProducts = values.applicableProducts?.map((product: any) => product.value) || []
        validCollections = []
      }

      const discount = {
        ...values,
        //@ts-ignore
        applicableProducts: [...new Set(validProducts)],
        applicableCollections: validCollections,
        type: values.type?.value,
        limitBy: values.limitBy?.value,
        limited
      }

      setSaving(true)

      await makeRequest('post', `/api/discounts`, discount);

      toast.success('Descuento creado')
      onOk && onOk()
      setSaving(false)
      reset()
    } catch (error: any) {
      console.log({ error })
      if (error) {
        toast.error(error.response.data.message)
        setSaving(false)
      }
    }
  }

  return (
    <Modal
      loadingState={saving}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
        resetForm()
      }}
      title='Nuevo descuento'
      onClose={() => {
        setVisible(false)
        resetForm()
      }}
      visible={visible}
    >
      <>
        <Input
          register={register}
          label='Nombre de descuento'
          name='name'
          errors={errors}
          required
        />
        <Select
          required
          onChange={(e: any) => {
            setDiscountType(e.value)
          }}
          options={discountTypes}
          errors={errors}
          control={control}
          name='type'
          label='Tipo de descuento'
        />
        {
          discountType !== '' &&
          <>
            <div className="d-flex align-center">
              <Input
                type='number'
                register={register}
                label='Valor del descuento'
                placeholder=''
                name='value'
                errors={errors}
                required
              />
              <span style={{
                display: 'block',
                marginLeft: 10,
                fontSize: 20
              }}>{discountType === 'percentage' ? '%' : '$'}</span>
            </div>
            <DatePicker
              label="Fecha de expiración"
              control={control}
              required
              errors={errors}
              name="endDate"
            />
            <Checkbox
              label='Activo'
              id='active'
              name='active'
              register={register}
            />
            <Checkbox
              register={register}
              label='Limitar a productos o colecciones'
              id='limited'
              name='limited'
              onChange={(e) => {
                setLimited(e.target.checked)
              }}
            />
          </>
        }
        {
          limited &&
          <>
            <Select
              onChange={(e: any) => {
                setLimitBy(e.value)
                if (e.value === 'product' && products.length === 0) {
                  fetchProducts()
                }
                if (e.value === 'collection' && collections.length === 0) {
                  fetchCollections()
                }
              }}
              required
              options={discountLimitBy}
              errors={errors}
              control={control}
              name='limitBy'
              label='Limitar por'
            />
            {
              limitBy === 'collection' &&
              <Select
                required
                options={collections.map(collection => ({
                  label: collection.name,
                  value: collection._id
                }))}
                errors={errors}
                control={control}
                isMulti
                name='applicableCollections'
                label='Colecciones que aplican'
              />
            }
            {
              limitBy === 'product' &&
              <Select
                required
                options={products.map(product => ({
                  label: product.name,
                  value: product._id
                }))}
                errors={errors}
                control={control}
                isMulti
                name='applicableProducts'
                label='Productos que aplican'
              />
            }
          </>
        }
      </>
    </Modal>
  )
}

export default AddDiscount