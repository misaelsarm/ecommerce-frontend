import { makeRequest } from "@/utils/makeRequest";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styles from '@/styles/admin/Users.module.scss'
import { UserRole } from "@/utils/types";
import { views } from "@/utils/views";
import { userRoles } from "@/utils/catalogs";
import { buildUserPermissions } from "@/utils/buildUserPermissions";
import { Checkbox, Input, Modal, Select } from "@/components/common";

interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddUser = ({ visible, setVisible, onOk }: Props) => {

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const [active, setActive] = useState(false)

  const [saving, setSaving] = useState(false)

  const [role, setRole] = useState<UserRole | undefined>()

  const onSubmit = async (values: any) => {

    try {

      const permissions = buildUserPermissions(values.permissions, values.role.value)

      const postedUser = {
        ...values,
        active,
        role: values.role.value,
        permissions
      }
      setSaving(true)

      await makeRequest('post', '/api/admin/users', postedUser)
      toast.success('Usuario agregado')
      setSaving(false)
      onOk && onOk()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al añadir usuario. ' + error)
      setSaving(false)
    }
  }

  return (
    <Modal
      loadingState={saving}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => {
        setVisible(false)
      }}
      title='Nuevo usuario'
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
          pattern={/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*$/}
        />
        <Input
          type='password'
          register={register}
          label='Contraseña'
          name='password'
          errors={errors}
          required
        />
        <Select
          control={control}
          errors={errors}
          required
          options={userRoles}
          name="role"
          label="Tipo de usuario"
          onChange={(e: any) => {
            setRole(e.value)
          }}
        />
        <Checkbox
          register={register}
          label='Activo'
          id='active'
          name='active'
          onChange={(e) => {
            setActive(e.target.checked)
          }}
        />
        {
          (role && role !== 'delivery' && role !== 'admin') &&
          <div className={styles.rolesWrapper}>
            <span>Elegir permisos de usuario</span>
            {
              views.map(role => (
                <div key={role.view} className={styles.viewWrapper}>
                  <div className={styles.view}>
                    <h4>{role.name}</h4>
                  </div>
                  <div className={styles.roles}>
                    <div className={styles.role}>
                      <Checkbox
                        register={register}
                        name={`permissions[${role.view}]`}
                        label='Ver'
                        id={`permissions[${role.view}]-view`}
                        value='view'
                      />
                    </div>
                    <div className={styles.role}>
                      <Checkbox
                        register={register}
                        name={`permissions[${role.view}]`}
                        label='Crear'
                        id={`permissions[${role.view}]-create`}
                        value='create'
                      />
                    </div>
                    <div className={styles.role}>
                      <Checkbox
                        register={register}
                        name={`permissions[${role.view}]`}
                        label='Editar'
                        id={`permissions[${role.view}]-edit`}
                        value='edit'
                      />
                    </div>
                    <div className={styles.role}>
                      <Checkbox
                        register={register}
                        name={`permissions[${role.view}]`}
                        label='Eliminar'
                        id={`permissions[${role.view}]-delete`}
                        value='delete'
                      />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        }
      </>
    </Modal >
  )
}

export default AddUser