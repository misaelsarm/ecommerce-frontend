import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { makeRequest } from "@/utils/makeRequest";
import { Checkbox, Input, Modal, Select } from "@/components/common";
import { ModalBaseProps } from "@/interfaces/ModalBaseProps";
import { ValueInterface } from "@/interfaces";
import { ValueType } from "@/utils/types";
import { valueTypesMap } from "@/utils/mappings";
import { useRouter } from "next/router";

interface Props extends ModalBaseProps {
  value?: ValueInterface
}

export const ValueModal = ({ visible, setVisible, title, value }: Props) => {

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  const [type, setType] = useState<ValueType | ''>(value?.type || '')

  const { replace } = useRouter()

  const resetForm = () => {
    if (!value) {
      reset()
      setType('')
    }
  }

  const onSubmit = async (values: any) => {
    const payload = {
      ...values,
      value: type === 'color' ? values.value : values.label.trim().toLowerCase().split(' ').join('-'),
      type: values.type.value
    }
    setSaving(true)
    try {
      let id = ''
      if (value) {
        await makeRequest('put', `/api/admin/values/${value._id}`, payload)
        toast.success('Valor actualizado')
        id = value._id

      } else {
        const response = await makeRequest('post', '/api/admin/values', payload)
        toast.success('Valor creado')
        id = response.value._id

      }

      setSaving(false)
      setVisible(false)
      replace(`/admin/attributes/${id}`)

    } catch (error: any) {
      toast.error(error.response.data.message)
      setSaving(false)
    }
  }

  useEffect(() => {
    if (value && visible) {
      console.log('first')
      reset({
        type: {
          label: valueTypesMap[value.type],
          value: value.type
        },
        label: value.label,
        value: value.value,
        active: value.active,
      })
    }
  }, [visible, value])

  return (
    <Modal
      title={title}
      visible={visible}
      loadingState={saving}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
        resetForm()
      }}
      onClose={() => {
        setVisible(false)
        resetForm()
      }}
    >
      <>
        <Select
          control={control}
          errors={errors}
          required
          options={[
            {
              label: 'Color',
              value: 'color'
            },
            {
              label: 'Opcion',
              value: 'option'
            },
          ]}
          name="type"
          label="Tipo de valor"
          onChange={(e: any) => {
            setType(e.value)
          }}
        />
        <Input
          register={register}
          label={`Nombre de ${type === 'color' ? 'color' : 'opción'}`}
          placeholder=''
          name='label'
          errors={errors}
          required
        />
        {
          type === 'color' &&
          <div className="group">
            <Input
              label='Código de color'
              name='value'
              type='color'
              register={register}
              placeholder=''
              errors={errors}
              required
            />
          </div>
        }
        <Checkbox
          label='Activo'
          id='active'
          name='active'
          register={register}
        />
      </>
    </Modal>
  )
}