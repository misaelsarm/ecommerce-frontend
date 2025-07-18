import { Checkbox, Input, Modal } from '@/components/common'
import { UserInterface } from '@/interfaces'
import { ModalBaseProps } from '@/interfaces/ModalBaseProps'
import { makeRequest } from '@/utils/makeRequest'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props extends ModalBaseProps {
  user?: UserInterface
}

export const CustomerModal = ({ visible, setVisible, title, user }: Props) => {

  const { replace } = useRouter()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<any>();

  const [saving, setSaving] = useState(false)

  const onSubmit = async (values: any) => {
    setSaving(true)

    try {
      const payload = {
        name: values.name,
        "email": values.email,
        "active": values.active,
      }


      await makeRequest('put', `/api/admin/users/${user?._id}`, payload)
      toast.success('Usuario actualizado')


      setSaving(false)
      setVisible(false)
      replace(`/admin/customers/${user?._id}`)
    } catch (error: any) {


      toast.error(error.response.data.message)
      setSaving(false)

    }
  }

  useEffect(() => {
    if (user && visible) {
      reset({
        "name": user.name,
        "email": user.email,
        "active": user.active,
      })
    }
  }, [user,visible])

  return (
    <Modal
      loadingState={saving}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
      }}
      title={title}
      onClose={() => {
        setVisible(false)
      }}
      visible={visible}
    >
      <>
        <Input
          register={register}
          label='Nombre'
          name='name'
          errors={errors}
          required
        />
        <Input
          type='email'
          register={register}
          label='Correo electrónico'
          name='email'
          errors={errors}
          required
        />
        <Checkbox
          register={register}
          label='Activo'
          id='active'
          name='active'
        />
      </>
    </Modal>
  )
}
