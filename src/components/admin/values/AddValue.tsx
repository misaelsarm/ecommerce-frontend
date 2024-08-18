import { api } from "@/api_config/api";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddValue = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  const [type, setType] = useState('')

  const resetForm = () => {
    reset()
    setType('')
  }

  const onSubmit = async (values: any) => {
    const post = {
      ...values,
      value: type === 'color' ? values.value : values.label.trim().toLowerCase().split(' ').join('-')
    }
    setSaving(true)
    try {
      await api.post('/api/values', post, {
        headers: {
          "x-access-token": Cookies.get('token')
          //"x-location": "admin"
        }
      })
      toast.success('Valor creado.')
      setSaving(false)
      setVisible(false)
      onOk && onOk()
      reset()
    } catch (error: any) {
      toast.error(error.response.data.message)
      setSaving(false)
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
      title='Nuevo valor'
      onClose={() => {
        setVisible(false)
        resetForm()
      }}
      visible={visible}

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

export default AddValue