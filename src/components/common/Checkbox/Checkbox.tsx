import React, { ChangeEventHandler, CSSProperties } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

interface Props {
  register?: UseFormRegister<FieldValues>,
  name?: string,
  label: string,
  value?: any
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
  style?: CSSProperties
  defaultChecked?: boolean,
  required?: boolean
  errors?: any
  id: string
}

const Checkbox = ({ register, name = 'name', label, onChange, required, id, value }: Props) => {
  return (
    <div className='checkbox-group'>
      <div className="checkbox">
        <input
          value={value}
          type="checkbox"
          id={id}
          //@ts-ignore
          {...register(name, {
            required: {
              value: required || false,
              message: 'Required'
            },
            onChange: (e) => {
              onChange?.(e);
            },
          })}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  )
}

export default Checkbox