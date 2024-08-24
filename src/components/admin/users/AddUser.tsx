import { api } from "@/api_config/api";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import { makeRequest } from "@/utils/makeRequest";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


interface Props {
  visible: boolean,
  setVisible: (visible: boolean) => void,
  onOk?: () => void
}

const AddUser = ({ visible, setVisible, onOk }: Props) => {

  const views = [
    {
      view: '/orders',
      name: 'Pedidos',
    },
    {
      view: '/products',
      name: 'Productos',
    },
    {
      view: '/attributes',
      name: 'Atributos de producto',
    },
    {
      view: '/values',
      name: 'Valores de atributo',
    },
    {
      view: '/collections',
      name: 'Colecciones',
    },
    {
      view: '/customers',
      name: 'Clientes',
    },
    {
      view: '/users',
      name: 'Usuarios',
    },
    {
      view: '/discounts',
      name: 'Descuentos',
    },
    {
      view: '/reportes/rutas',
      name: 'Reporte de rutas',
    },
    {
      view: '/reportes/repartidores',
      name: 'Reporte de repartidores',
    },
    {
      view: '/reportes/ventas',
      name: 'Reporte de ventas',
    },
    {
      view: '/general',
      name: 'General',
    },
  ]

  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const [saving, setSaving] = useState(false)

  const onSubmit = async (values: any) => {

    try {

      const permissions = values.permissions

      let mapped: any[] = []

      if (permissions) {
        mapped = Object.keys(permissions).map(role => ({
          view: role,
          permissions: permissions[role] || [],
        }))
      }

      const access = [...mapped]

      const postedUser = {
        ...values,
        permissions: access.filter(role => role.permissions.length > 0),
      }

       console.log({postedUser})

      setSaving(true)

      await makeRequest('post', '/api/users', postedUser)
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
      <div>
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
          options={[
            {
              label: 'Administrador',
              value: 'admin'
            },
            {
              label: 'Usuario',
              value: 'user'
            },
            {
              label: 'Repartidor',
              value: 'delivery'
            },
          ]}
          name="role"
          label="Tipo de acceso"
        />
        {/* <div className="group">
          <span>Tipo de acceso</span>
          <Controller
            name="role"
            control={control}
            render={({ field: { onChange, onBlur, value } }) =>
              <Select
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                placeholder='Tipo de acceso'
                isSearchable={true}
                options={[
                  {
                    label: 'Administrador',
                    value: 'admin'
                  },
                  {
                    label: 'Usuario',
                    value: 'user'
                  },
                  {
                    label: 'Repartidor',
                    value: 'delivery'
                  },
                ]}
              />}
          />
          {errors.category && <span className='error'>Campo requerido</span>}
        </div> */}

        {/* <div className={styles.rolesWrapper}>
          <span>Elegir accesos de usuario</span>
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
                      label='Crear / Editar'
                      id={`permissions[${role.view}]-create-edit`}
                      value='create-edit'
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
        </div> */}
        <Checkbox
          register={register}
          label='Activo'
          id='active'
          name='active'
        />
      </div>
    </Modal >
  )
}

export default AddUser