
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import TextArea from '@/components/common/TextArea'
import React from 'react'

const index = () => {

  const options = [
    {
      label: 'opcion 1',
      value: 'opcion 1'
    },
    {
      label: 'opcion 2',
      value: 'opcion 2'
    },
    {
      label: 'opcion 3',
      value: 'opcion 3'
    },
  ]

  return (
    <div
      style={{
        maxWidth: 500,
        margin: 'auto',
        padding: '50px 0'
      }}
    >
      <h1 className='mb-30'>Componentes </h1>
      <div className='mb-30'>
        <h3>Boton</h3>
        <div className='d-flex'>
          <button className='btn mr-10'>Hello world!</button>
          <button className='btn btn-black mr-10'>Hello world!</button>
          <button className='btn btn-gradient mr-10'>Hello world!</button>
          <button className='btn btn-ghost'>Hello world!</button>
        </div>
      </div>
      <div className='mb-30'>
        <h3>Input</h3>
        <div>
          <Input />
        </div>
      </div>
      <div className='mb-30'>
        <h3>TextArea</h3>
        <div>
          <TextArea />
        </div>
      </div>
      <div className='mb-30'>
        <h3>Select</h3>
        <div>
          <Select options={options} />
        </div>
      </div>
    </div>
  )
}

export default index