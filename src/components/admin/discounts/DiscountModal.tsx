import { Checkbox, DatePicker, Input, Modal, Select } from "@/components/common";
import { CollectionInterface, DiscountInterface, ProductInterface } from "@/interfaces";
import { ModalBaseProps } from "@/interfaces/ModalBaseProps";
import { discountLimitBy, discountTypes } from "@/utils/catalogs";
import { makeRequest } from "@/utils/makeRequest";
import { discountLimitByMap, discountTypesMap } from "@/utils/mappings";
import { DiscountType, LimitBy } from "@/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props extends ModalBaseProps {
  discount?: DiscountInterface
}

export const DiscountModal = ({ visible, setVisible, title, discount }: Props) => {

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  const [products, setProducts] = useState<ProductInterface[]>([])

  console.log({ products })

  const [collections, setCollections] = useState<CollectionInterface[]>([])

  const [limitBy, setLimitBy] = useState<LimitBy | ''>(discount?.limitBy || '')

  const [discountType, setDiscountType] = useState<DiscountType | ''>(discount?.type || '')

  const [limited, setLimited] = useState(discount?.limited || false)

  const { replace } = useRouter()

  const resetForm = () => {
    if (!discount) {
      reset()
      setLimitBy('')
      setDiscountType('')
      setLimited(false)
    }
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

      const payload = {
        ...values,
        //@ts-ignore
        applicableProducts: [...new Set(validProducts)],
        applicableCollections: validCollections,
        type: values.type?.value,
        limitBy: values.limitBy?.value
      }



      setSaving(true)

      let id = ''

      if (discount) {

        await makeRequest('put', `/api/admin/discounts/${discount._id}`, payload);
        toast.success('Descuento actualizado')
        id = discount._id
      } else {
        const response = await makeRequest('post', `/api/admin/discounts`, payload);
        toast.success('Descuento creado')
        id = response.discount._id
      }

      setSaving(false)
      reset()
      replace(`/admin/discounts/${id}`)
    } catch (error: any) {
      console.log({ error })
      if (error) {
        toast.error(error.response.data.message)
        setSaving(false)
      }
    }
  }

  useEffect(() => {

    if (visible && discount) {
      reset({
        "name": discount.name,
        "value": discount.value,
        "active": discount.active,
        "endDate": discount.endDate,
        "applicableProducts": discount.applicableProducts?.map(item => ({
          label: item.name,
          value: item._id
        })),
        "applicableCollections": discount.applicableCollections?.map(item => ({
          label: item.name,
          value: item._id
        })),
        limitBy: {
          label: discountLimitByMap[discount.limitBy],
          value: discount.limitBy
        },
        type: {
          label: discountTypesMap[discount.type],
          value: discount.type
        },
        limited: discount.limited
      })
      fetchProducts()
      fetchCollections()
    }
  }, [visible, discount])

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