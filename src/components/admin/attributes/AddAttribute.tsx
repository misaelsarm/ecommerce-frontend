import Input from "@/components/common/Input"
import Modal from "@/components/common/Modal"
import Select from "@/components/common/Select"
import { ValueInterface } from "@/interfaces"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { attributeTypes } from "@/utils/attributeTypes"
import Checkbox from "@/components/common/Checkbox"
import { makeRequest } from "@/utils/makeRequest"

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddAttribute = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, control, reset, resetField, formState: { errors } } = useForm();

  const [values, setValues] = useState([] as ValueInterface[])

  const [type, setType] = useState()

  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    reset()
    setType(undefined)
  }

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  async function fetchData() {
    try {
      const data = await makeRequest('get', '/api/values')
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
      await makeRequest('post', '/api/attributes', attribute)
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
              return option?.value === 'option'
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