
import { Sortable } from '@/components/admin/Sortable'
import Chip from '@/components/common/Chip'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import TextArea from '@/components/common/TextArea'
import React, { useState } from 'react'

const Index = () => {

  const [items, setItems] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

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
        maxWidth: 800,
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
        <h3>Chips</h3>
        <div className='d-flex'>
          <Chip color='dark' text='Dark chip' />
          <Chip color='blue' text='Blue chip' />
          <Chip color='green' text='Green chip' />
          <Chip color='yellow' text='Yellow chip' />
          <Chip color='red' text='Red chip' />
        </div>
      </div>
      <div className='mb-30'>
        <h3>Text Input</h3>
        <div>
          <Input />
        </div>
      </div>
      <div className='mb-30'>
        <h3>Password Input</h3>
        <div>
          <Input type='password' />
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
      <div className='mb-30'>
        <h3>Sortable</h3>
       {/*  <Sortable items={items} label='' setItems={setItems} uploading={false} /> */}
      </div>
    </div>
  )
}

export default Index