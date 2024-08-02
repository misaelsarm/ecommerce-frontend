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
}

const TextArea = ({ placeholder, pattern, register, required, minLength, name = '', defaultValue, errors, label }: Props) => {

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
      <label
        style={{
          marginBottom: 5
        }}
        htmlFor={name}>{label}</label>
      <textarea
        className='input'
        defaultValue={defaultValue}
        {...registerProps}
        autoComplete='new-password'
        placeholder={placeholder}
      />
      {
        errors && errors[name] &&
        <span className='error'>{errors[name].message}</span>
      }
    </div>
  )
}

export default TextArea
