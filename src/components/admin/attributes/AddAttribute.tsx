import { ValueInterface } from "@/interfaces"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { attributeTypes } from "@/utils/attributeTypes"
import { makeRequest } from "@/utils/makeRequest"
import Modal from "@/components/common/Modal/Modal"
import Input from "@/components/common/Input/Input"
import Select from "@/components/common/Select/Select"
import Checkbox from "@/components/common/Checkbox/Checkbox"

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddAttribute = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, control, reset, resetField, formState: { errors } } = useForm();

  const [values, setValues] = useState([] as ValueInterface[])

  const [type, setType] = useState<'dropdown' | 'color' | 'long-text' | 'short-text' | ''>('')

  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    reset()
    setType('')
  }

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  async function fetchData() {
    try {
      const data = await makeRequest('get', '/api/values?active=true',
        {
          headers: {
            "x-access-token": Cookies.get('token')
            //"x-location": "admin"
          }
        }
      )
      setValues(data.values)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  const onSubmit = async (values: any) => {

    setSaving(true)
    try {
      const attribute = {
        ...values,
        values: values.values?.map((value: any) => value.value),
        type: values.type.value
      }
      await makeRequest('post', '/api/attributes?active=true', attribute)
      toast.success('Atributo agregado')
      setSaving(false)
      onOk && onOk()
      resetForm()
    } catch (error: any) {
      setSaving(false)
      toast.error(error.response.data.message)
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
          options={attributeTypes}
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
              return option.type === 'color'
            }).map((item) => ({
              label: item.label,
              value: item._id
            }))}
            name="values"
            control={control}
            required
            errors={errors}
            isMulti
          />
        }
        {
          type === 'dropdown' &&
          <Select
            label="Valores de atributo"
            options={values.filter((option) => {
              return option.type === 'option'
            }).map((item) => ({
              label: item.label,
              value: item._id
            }))}
            name="values"
            control={control}
            required
            errors={errors}
            isMulti
          />
        }
        {
          (type === 'short-text' || type === 'long-text') &&
          <Input
            type='number'
            inputMode='numeric'
            register={register}
            label='Máximo de caracteres'
            name='max'
            errors={errors}
          />
        }
        {
          (type === 'color') &&
          <Input
            type='number'
            inputMode='numeric'
            register={register}
            label='Máximo de opciones permitidas a elegir'
            name='max'
            errors={errors}
          />

        }
        <Checkbox
          register={register}
          label='Activo'
          id='active'
          name='active'
        />
      </>
    </Modal >
  )
}

export default AddAttribute