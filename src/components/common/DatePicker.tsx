import React, { useState } from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import ReactSelect from 'react-select';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  control?: Control<FieldValues, any>;
  label?: string;
  name?: string;
  required?: boolean;
  errors?: FieldErrors<FieldValues>;
  placeholder?: string;
  onChange?: any;
}

const DatePicker: React.FC<Props> = ({
  control,
  label,
  name = 'name',
  required,
  errors,
  placeholder = 'Elige una opción',
  onChange: onChangeProp,
}) => {

  const [startDate, setStartDate] = useState(new Date());

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
            <ReactDatePicker
              minDate={new Date()}
              dateFormat='dd-MM-yyyy'
              selected={startDate}
              onChange={(date) => {
                onChange(date)
                //@ts-ignore
                setStartDate(date)
              }}
            />
          )}
        />
      ) : null
        // <ReactSelect
        //   onChange={onChangeProp}
        //   isSearchable={true}
        //   options={options}
        //   placeholder={placeholder}
        //   isMulti={isMulti}
        // />
      }
      {errors && errors[name] && (
        <span className='error'>
          {/* @ts-ignore */}
          {errors[name].message}
        </span>
      )}
    </div>
  );
};

export default DatePicker;
