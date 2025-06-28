import React from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import ReactSelect from 'react-select';

interface Props {
  control?: Control<FieldValues, any>;
  options: { label: string, value: string }[];
  label?: string;
  name?: string;
  required?: boolean;
  errors?: FieldErrors<FieldValues>;
  isMulti?: boolean;
  placeholder?: string;
  onChange?: any;
}

const Select: React.FC<Props> = ({
  control,
  options,
  label,
  name = 'name',
  required,
  errors,
  isMulti,
  placeholder = 'Elige una opción',
  onChange: onChangeProp,
}) => {
  return (
    <div className='input-group'>
      {label && <label>{label}</label>}
      {control ? (
        <Controller
          name={name}
          control={control}
          rules={{
            required: {
              value: required || false,
              message: 'Campo requerido',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ReactSelect
              onChange={(e) => {
                onChange(e);
                if (onChangeProp) {
                  onChangeProp(e);
                }
              }}
              onBlur={onBlur}
              value={value}
              isSearchable={true}
              options={options}
              placeholder={placeholder}
              isMulti={isMulti}
            />
          )}
        />
      ) : (
        <ReactSelect
          onChange={onChangeProp}
          isSearchable={true}
          options={options}
          placeholder={placeholder}
          isMulti={isMulti}
        />
      )}
      {errors && errors[name] && (
        <span className='error'>
          {/* @ts-ignore */}
          {errors[name].message}
        </span>
      )}
    </div>
  );
};

export default Select;
