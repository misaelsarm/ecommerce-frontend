import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { AttributeInterface, ValueInterface } from "@/interfaces"
import { attributeTypes } from "@/utils/attributeTypes"
import { makeRequest } from "@/utils/makeRequest"
import { Modal, Input, Select, Checkbox } from '@/components/common'
import { AttributeType } from "@/utils/types"
import { attributeTypesMap } from "@/utils/mappings"
import { ModalBaseProps } from "@/interfaces/ModalBaseProps"
import { useRouter } from "next/router"

interface Props extends ModalBaseProps {
  attribute?: AttributeInterface
}

export const AttributeModal = ({ visible, setVisible, title, attribute }: Props) => {

  const { register, handleSubmit, control, reset, resetField, formState: { errors } } = useForm();

  const [values, setValues] = useState([] as ValueInterface[])

  const [type, setType] = useState<AttributeType | ''>(attribute?.type || '')

  const [saving, setSaving] = useState(false)

  const { replace } = useRouter()

  const resetForm = () => {
    reset()
    setType('')
  }

  async function fetchValues() {
    try {
      const data = await makeRequest('get', '/api/admin/values?active=true')
      setValues(data.values)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error')
    }
  }

  const onSubmit = async (values: any) => {

    setSaving(true)
    try {
      const payload = {
        ...values,
        values: values.values?.map((value: any) => value.value),
        type: values.type.value
      }

      let id = ''
      if (attribute) {
        await makeRequest('put', `/api/admin/attributes/${attribute._id}`, payload)
        toast.success('Atributo actualizado')
        id = attribute._id
      } else {
        const response = await makeRequest('post', '/api/admin/attributes', payload)
        toast.success('Atributo agregado')
        id = response.attribute._id
      }
      setSaving(false)
      setVisible(false)
      replace(`/admin/attributes/${id}`)
      resetForm()
    } catch (error: any) {
      setSaving(false)
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if (visible && attribute) {
      reset({
        longName: attribute.longName,
        shortName: attribute.shortName,
        max: attribute.max,
        values: attribute.values.map(val => ({
          label: val.label,
          value: val._id
        })),
        active: attribute.active,
        type: {
          label: attributeTypesMap[attribute.type],
          value: attribute.type
        }
      })
    }

  }, [visible, attribute])

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
            if ((e.value === 'dropdown' || e.value === 'color') && values.length === 0) {
              fetchValues()
            }
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