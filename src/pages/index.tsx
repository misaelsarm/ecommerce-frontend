import {Button, Card, CardItem, Chip, Input, Modal, Select, TextArea} from '@/components/common'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import React, { useState } from 'react'

const Index = () => {

  const [items, setItems] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9'])

  const [visible, setVisible] = useState(false)

  const user = useAuthStore((state) => state.user)

  const loading = useAuthStore((state) => state.loading)

  const setTheme = useThemeStore((state) => state.setTheme)


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
      {
        loading ? <h2>Loading...</h2> : <h2>¡Hola, {user.name}!</h2>
      }
      <div className='mb-30'>
        <h3>Boton</h3>
        <div className='d-flex'>
          
          <Button>Hello primary!</Button>
          <Button variant='primary'>Hello primary!</Button>
          <Button variant='secondary'>Hello secondary!</Button>


          {/* <button className='btn mr-10'>Hello world!</button>

          <button className='btn btn-gradient mr-10'>Hello world!</button>
          <button className='btn btn-ghost'>Hello world!</button> */}
        </div>
      </div>
      <div className='mb-30'>
        <h3>Chips</h3>
        <div className='d-flex'>
          <Chip text='Default chip' />
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
        <h3>Card</h3>
        <div>
          <Card>
            <CardItem
              title='Card title'
              content={<>
                <span>This is the content</span>
              </>}
            />
          </Card>
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
      <div className='mb-30'>
        <h3>Modal</h3>
        <div>
          <button
            onClick={() => setVisible(true)}
            className='btn btn-black'>Open Auth Modal</button>
          <Modal
            wrapperStyle={{
              width: 500
            }}
            bodyStyle={{
              height: 'auto',
              padding: 25,
              paddingTop: 0,
            }}
            onClose={() => setVisible(false)}
            visible={visible as boolean}
            title='Modal title'
          >
            <div>This is the modal body!</div>
          </Modal>
        </div>
        {/*  <Sortable items={items} label='' setItems={setItems} uploading={false} /> */}
      </div>
    </div>
  )
}

export default Index