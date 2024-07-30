import React, { CSSProperties, FC } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

interface Props {
  register: UseFormRegister<FieldValues>,
  name: string,
  label: string,
  value?: any
  id: string
  onChange?: any
  style?: CSSProperties
  defaultChecked?: boolean,
  required?: boolean
  errors?: any
}

const Checkbox: FC<Props> = ({ register, defaultChecked, name, label, value, id, onChange, style, required, errors }) => {
  return (
    <div className='group'>
      <div
        style={style}
        className='checkbox'
      >
        <input
          defaultChecked={defaultChecked}
          {
          ...register && {
            ...register(name, {
              required: {
                value: required || false,
                message: 'Campo requerido'
              },
            })
          }
          }
          type="checkbox"
          id={id}
          value={value}
          onChange={(e)=>{
            onChange && onChange(e)
          }}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {
        errors && errors[name] &&
        <span className='error'>{errors[name].message}</span>
      }
    </div>
  )
}

export default Checkbox