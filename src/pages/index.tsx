import { ProductModal } from '@/components/admin/products/ProductModal'
import { Button, Card, CardItem, Chip, Input, Modal, Page, Select, TextArea } from '@/components/common'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import React, { useState } from 'react'

const Index = () => {

  const [items, setItems] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9'])

  const [visible, setVisible] = useState(false)

  const user = useAuthStore((state) => state.user)

  const loading = useAuthStore((state) => state.loading)

  const setTheme = useThemeStore((state) => state.setTheme)

  const currentTheme = useThemeStore((state) => state.theme)

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
    <Page
      title='Componentes'
    >
      <div className='mb-30'>


        <button onClick={() => setTheme(currentTheme.name === 'light' ? 'dark' : 'light')}>
          Switch to {currentTheme.name === 'light' ? 'Dark' : 'Light'} Mode
        </button>

        <h3>Boton</h3>
        <div className='d-flex flex-wrap'>

          <Button>Hello primary!</Button>
          <Button variant='primary'>Hello primary!</Button>
          <Button variant='secondary'>Hello secondary!</Button>
          <Button variant='link' url='/admin/login'>This is a link</Button>


          {/* <button className='btn mr-10'>Hello world!</button>

          <button className='btn btn-gradient mr-10'>Hello world!</button>
          <button className='btn btn-ghost'>Hello world!</button> */}
        </div>
      </div>
      <div className='mb-30'>
        <h3>Chips</h3>
        <div className='d-flex flex-wrap'>
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
              title='Card item title 1'
              content={<>
                <span>This is the first card item content</span>
              </>}
            />
            <CardItem
              title='Card item title 2'
              content={<>
                <span>This is the second card item content</span>
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
          <Button
            onClick={() => setVisible(true)}
          >Open Modal</Button>
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
            footer={
              <>
                <Button variant='secondary'>Anterior</Button>
                <Button>Siguiente</Button>
              </>
            }
          >
            <div>This is the modal body!</div>
          </Modal>

          {/* <ProductModal
            visible
          /> */}
        </div>
        {/*  <Sortable items={items} label='' setItems={setItems} uploading={false} /> */}
      </div>
    </Page>
  )
}

export default Index