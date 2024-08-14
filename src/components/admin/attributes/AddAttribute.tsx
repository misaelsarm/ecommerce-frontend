import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import { ValueInterface } from "@/interfaces"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const options = [
  {
    id: 1,
    label: 'Lista desplegable',
    value: 'dropdown'
  },
  {
    id: 2,
    label: 'Color',
    value: 'color'
  },
  {
    id: 3,
    label: 'Texto largo',
    value: 'long-text'
  },
  {
    id: 4,
    label: 'Texto corto',
    value: 'short-text'
  },
  /*   {
      id: 5,
      label: 'Font',
      value: 'font'
    } */
]

const AddAttribute = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, control, reset, resetField, formState: { errors } } = useForm();

  const [values, setValues] = useState([] as ValueInterface[])

  const [type, setType] = useState<'dropdown' | 'color' | 'long-text' | 'short-text' | ''>('')

  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    reset()
    setType('')
  }

  // useEffect(() => {
  //   fetchData();
  // }, []); // Or [] if effect doesn't need props or state

  // async function fetchData() {
  //   try {
  //     const { data } = await api.get('/api/values')
  //     setValues(data.values)
  //   } catch (error) {
  //   }
  // }

  const onSubmit = async (data: any) => {
    // setSaving(true)
    // try {
    //   const attribute = {
    //     ...data,
    //     values: data.values?.map((value: any) => value.value)
    //   }
    //   await api.post('/api/attributes', attribute)
    //   toast.success('Atributo agregado')
    //   setSaving(false)
    //   onOk && onOk()
    //   reset()
    // } catch (error: any) {
    //   setSaving(false)
    //   toast.error(error.response.data.message)
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
      title='Nuevo atributo'
      onClose={() => {
        setVisible(false)
        resetForm()
      }}
      visible={visible}
    >
      <>
        <Input
          register={register}
          label='Nombre corto'
          name='shortName'
          errors={errors}
          required
        />
        <Input
          register={register}
          label='Nombre largo'
          name='longName'
          errors={errors}
          required
        />
        <Select
          label="Tipo de atributo"
          options={options}
          name="type"
          control={control}
          required
          errors={errors}
          onChange={(e: any) => {
            setType(e.value)
            resetField('values')
          }}
        />
        {
          type === 'color' &&
          <Select
            label="Valores de atributo"
            options={values.filter((option) => {
              return option.type?.value === 'color'
            }).map((item) => ({
              label: item.label,
              value: item._id
            }))}
            name="values"
            control={control}
            required
            errors={errors}
            onChange={(e: any) => {
              setType(e.value)
              resetField('values')
            }}
          />
        }
        {
          type === 'dropdown' &&
          <Select
            label="Valores de atributo"
            options={values.filter((option) => {
              return option.type?.value === 'option'
            }).map((item: any) => ({
              label: item.label,
              value: item.id
            }))}
            name="values"
            control={control}
            required
            errors={errors}
            onChange={(e: any) => {
              setType(e.value)
              resetField('values')
            }}
            isMulti
          />
        }
        {
          (type === 'short-text' || type === 'long-text') &&
          <div className="group">
            <Input
              type='number'
              inputMode='numeric'
              register={register}
              label='Máximo de caracteres'
              placeholder='Máximo de caracteres'
              name='max'
              errors={errors}
            />
          </div>
        }
      </>
    </Modal >
  )
}

export default AddAttribute