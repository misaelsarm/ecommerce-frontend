import Checkbox from '@/components/common/Checkbox'
import Input from '@/components/common/Input'
import TextArea from '@/components/common/TextArea'
import React, { useState } from 'react'

const ProductFields = ({ register, errors }: any) => {

  const [hasDiscount, setHasDiscount] = useState(true)

  return (
    <>
      <Input
        register={register}
        name='name'
        errors={errors}
        label='Nombre del producto'
        required
      />
      <TextArea
        register={register}
        name='description'
        errors={errors}
        label='Descripción del producto'
        required
      />
      <Input
        register={register}
        label='Palabras clave'
        name='keywords'
      />
      <Input
        type='number'
        register={register}
        name='price'
        errors={errors}
        label='Precio'
        required
      />
      <Checkbox
        label='Tiene descuento'
        id='hasDiscount'
        onChange={(e) => {
          setHasDiscount(e.target.checked)
        }}
        name='hasDiscount'
      />
      {
        hasDiscount &&
        <div className="group">
          <Input
            required
            register={register}
            placeholder='Valor del descuento'
            name='discountValue'
            errors={errors}
            label='Valor del descuento'
          />
        </div>
      }
      <Checkbox
        label='Activo'
        id='active'
        name='active'
      />
      <Checkbox
        label='Es personalizable'
        id='isCustomizable'
        name='isCustomizable'
      />

      {/* <div className="group">
        <input
          {...subscribeToIsCustomizable}
          onChange={() => {
            resetField('attributes')
          }}
          type="checkbox"
          name="isCustomizable"
          id="isCustomizable"
        />
        <label htmlFor="isCustomizable">Es personalizable</label>
      </div> */}
      {/* <Upload
          url={`/api/files/multiple`}
          images={images}
          setImages={setImages}
        /> */}
    </>
  )
}

export default ProductFields