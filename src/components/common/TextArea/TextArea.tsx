import { HTMLInputTypeAttribute } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

interface Props {
  placeholder?: string,
  type?: HTMLInputTypeAttribute,
  name?: string,
  register?: UseFormRegister<FieldValues>,
  required?: boolean,
  defaultValue?: any,
  errors?: any,
  minLength?: number,
  pattern?: any,
  label?: string
  max?: number
}

export const TextArea = ({ placeholder, pattern, register, required, max, minLength, name = '', defaultValue, errors, label }: Props) => {

  const registerProps = register
    ? register(name, {
      required: {
        value: required || false,
        message: 'Campo requerido',
      },
      minLength: {
        value: minLength || 0,
        message: 'Minimo ' + minLength + ' caracteres',
      },
      maxLength: {
        value: max as number,
        message: 'Máximo ' + max + ' caracteres',
      },
      pattern: {
        value: pattern,
        message: 'No valido',
      },
    })
    : {};

  return (
    <div className='input-group'>
      <label
        style={{
          marginBottom: 5
        }}
        htmlFor={name}>{label}</label>
      <textarea
        {...registerProps}
        placeholder={placeholder}
        className='input text-area'
        defaultValue={defaultValue}
      />
      {
        errors && errors[name] &&
        <span className='error'>{errors[name].message}</span>
      }
      {
        typeof errors === 'string' &&
        <span className='error'>{errors}</span>
      }
    </div>
  )
}