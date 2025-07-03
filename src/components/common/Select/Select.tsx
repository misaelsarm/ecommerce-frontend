import React from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';

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
  value?: any
  creatable?: boolean
  formatCreateLabel?: any
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
  value,
  creatable,
  formatCreateLabel
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
            creatable ?

              <CreatableSelect
                formatCreateLabel={formatCreateLabel}
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

              :


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
        creatable ? <CreatableSelect
          onChange={onChangeProp}
          isSearchable={true}
          options={options}
          placeholder={placeholder}
          isMulti={isMulti}
          value={value}
          formatCreateLabel={formatCreateLabel}

        /> : <ReactSelect
          onChange={onChangeProp}
          isSearchable={true}
          options={options}
          placeholder={placeholder}
          isMulti={isMulti}
          value={value}

        />
      )}
      {
        errors && errors[name] &&
        /* @ts-ignore */
        <span className='error'>{errors[name].message}</span>
      }
      {
        typeof errors === 'string' &&
        <span className='error'>{errors}</span>
      }
    </div>
  );
};

export default Select;
