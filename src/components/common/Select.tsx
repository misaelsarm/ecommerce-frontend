import React from 'react'
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form'
import ReactSelect from 'react-select'

interface Props {
  control: Control<FieldValues, any>
  options: { label: string, value: string }[]
  label?: string
  name: string
  required?: boolean
  errors?: FieldErrors<FieldValues>
  isMulti?: boolean,
  placeholder?: string
  onChange?: any
}

const Select = ({ control, options, label, name, required, errors, isMulti, placeholder = 'Elige una opción', onChange: onChangeProp }: Props) => {

  return (
    <div className='input-group'>
      <label>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: {
            value: required || false,
            message: 'Campo requerido'
          },
        }}
        render={({ field: { onChange, onBlur, value } }) =>
          <ReactSelect
            onChange={(e) => {
              onChange(e)
              onChangeProp && onChangeProp(e)
            }}
            onBlur={onBlur}
            value={value}
            isSearchable={true}
            options={options}
            placeholder={placeholder}
            isMulti={isMulti}
          />}
      />
      {
        (errors && errors[name]) &&
        //@ts-ignore
        <span className='error'>{errors[name].message}</span>
      }
    </div>

  )
}

export default Select