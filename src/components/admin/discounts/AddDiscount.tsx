import Checkbox from "@/components/common/Checkbox";
import DatePicker from "@/components/common/DatePicker";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import { CollectionInterface, ProductInterface } from "@/interfaces";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddDiscount = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();

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

  // const fetchProducts = async () => {
  //   try {
  //     const { data } = await api.get('/api/products?active=true')
  //     setProducts(data.products)
  //   } catch (error) {
  //     console.log({ error })
  //   }
  // }
  // const fetchCategories = async () => {
  //   try {
  //     const { data } = await api.get('/api/categories?active=true')
  //     setCategories(data.categories)
  //   } catch (error) {
  //     console.log({ error })
  //   }
  // }
  // const fetchSubcategories = async () => {
  //   try {
  //     const { data } = await api.get('/api/subcategories?active=true')
  //     setSubcategories(data.subcategories)
  //   } catch (error) {
  //     console.log({ error })
  //   }
  // }

  // useEffect(() => {
  //   fetchProducts()
  //   fetchCategories()
  //   fetchSubcategories()
  // }, [])

  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const onSubmit = async (values: any) => {

    // let validProducts = []

    // let validSubcategories = []

    // let validCategories = []

    // let foundProducts = []

    // if (limitBy === 'category') {
    //   let selectedCategories = values.categories.map((cat: any) => cat.value)

    //   let foundsubcats = []

    //   for (const subcategory of subcategories) {
    //     for (const cat of subcategory.categories) {
    //       if (selectedCategories.includes(cat._id)) {
    //         foundsubcats.push(subcategory.id)
    //       }
    //     }
    //   }

    //   for (const product of products) {

    //     for (const subcat of product.subCategories) {
    //       if (foundsubcats.includes(subcat._id)) {
    //         foundProducts.push(product.id)
    //       }
    //     }
    //   }

    //   validProducts = foundProducts
    //   validSubcategories = foundsubcats
    //   validCategories = selectedCategories

    // } else if (limitBy === 'subcategory') {
    //   let selectedSubcategories = values.subcategories.map((cat: any) => cat.value)

    //   for (const product of products) {

    //     for (const subcat of product.subCategories) {
    //       if (selectedSubcategories.includes(subcat._id)) {
    //         foundProducts.push(product.id)
    //       }
    //     }
    //   }

    //   validProducts = foundProducts
    //   validSubcategories = selectedSubcategories

    // } else {

    //   validProducts = values.products?.map((product: any) => product.value)
    // }

    // const discount = {
    //   ...values,
    //   products: validProducts,
    //   categories: validCategories,
    //   subcategories: validSubcategories
    // }

    // setSaving(true)
    // try {
    //   //await api.post('/api/discounts', discount)

    //   await makeRequest('post', `/api/discounts`, discount);


    //   toast.success('Descuento creado')
    //   onOk && onOk()
    //   setSaving(false)
    //   reset()
    // } catch (error: any) {
    //   if (error) {
    //     toast.error(error.response.data.message)
    //     setSaving(false)
    //   }
    // }
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
      <div>
        <div className="group">
          <Input
            register={register}
            label='Nombre de descuento'
            name='name'
            errors={errors}
            required
          />
        </div>
        <div className="group">
          <Select
            required
            onChange={(e: any) => {
              console.log({ e })
              setDiscountType(e.value)
            }}
            options={[
              {
                label: 'Porcentaje',
                value: 'percentage'
              },
              {
                label: 'Monto fijo',
                value: 'fixed'
              },
            ]}
            errors={errors}
            control={control}
            name='type'
            label='Tipo de descuento'
          />
        </div>
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
            />
            <Checkbox
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
              options={[
                {
                  label: 'Colección',
                  value: 'collection'
                },
                {
                  label: 'Producto',
                  value: 'product'
                },
              ]}
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
                  value: collection.id
                }))}
                errors={errors}
                control={control}
                isMulti
                name='collections'
                label='Colecciones que aplican'
              />
            }
            {
              limitBy === 'product' &&
              <Select
                required
                options={products.map(product => ({
                  label: product.name,
                  value: product.id
                }))}
                errors={errors}
                control={control}
                isMulti
                name='products'
                label='Productos que aplican'
              />
            }
          </>
        }
      </div>
    </Modal>
  )
}

export default AddDiscount