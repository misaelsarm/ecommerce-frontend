import { ChangeEventHandler, HTMLInputTypeAttribute, useState } from 'react'
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
  max?: number
  pattern?: any
  disabled?: boolean,
  inputMode?: any
  label?: string
  validate?: any
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const Input = ({ placeholder, type = 'text', pattern, register, required, max, minLength, name = 'name', defaultValue, errors, disabled, inputMode, label, validate, value, onChange }: Props) => {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='input-group'>
      <label htmlFor={name}>{label}</label>
      {
        type === 'password' ?
          <div className="password-wrapper">
            <input
              //autoComplete='new-password'
              className='input'
              type={
                showPassword ? 'text' : 'password'
              }
              inputMode={inputMode}
              disabled={disabled}
              {...register && {
                ...register(name, {
                  required: {
                    value: required || false,
                    message: 'Required'
                  },
                  minLength: {
                    value: minLength || 0,
                    message: 'Minimo ' + minLength + ' caracteres'
                  },
                  maxLength: {
                    value: max as number,
                    message: 'Máximo ' + minLength + ' caracteres'
                  },
                  pattern: {
                    value: pattern,
                    message: 'No valido'
                  },
                  validate
                })
              }}
              defaultValue={defaultValue}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
            {
              showPassword ?
                <svg onClick={() => setShowPassword(!showPassword)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg> :
                <svg onClick={() => setShowPassword(!showPassword)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            }
          </div>
          : <input
            //autoComplete='new-password'
            inputMode={inputMode}
            disabled={disabled}
            {...register && {
              ...register(name, {
                required: {
                  value: required || false,
                  message: 'Requerido'
                },
                minLength: {
                  value: minLength || 0,
                  message: 'Minimo ' + minLength + ' caracteres'
                },
                pattern: {
                  value: pattern,
                  message: 'No valido'
                }
              })
            }}
            className='input'
            defaultValue={defaultValue}
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
          />
      }
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
