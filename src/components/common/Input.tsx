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
  pattern?: any
  disabled?: boolean,
  inputMode?: any
  label?: string
}

const Input = ({ placeholder, type = 'text', pattern, register, required, minLength, name = 'name', defaultValue, errors, disabled, inputMode, label }: Props) => {

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
      pattern: {
        value: pattern,
        message: 'No valido',
      },
    })
    : {};

  return (
    <div className='input-group'>
      <label htmlFor={name}>{label}</label>
      <input
        inputMode={inputMode}
        disabled={disabled}
        {...registerProps}
        className='input'
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
      />
      {
        errors && errors[name] &&
        <span className='error'>{errors[name].message}</span>
      }
    </div>
  )
}

export default Input
