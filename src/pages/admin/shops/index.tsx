import { api } from '@/api_config/api';
import Layout from '@/components/admin/Layout'
import Modal from '@/components/ui/Modal';
import Table from '@/components/admin/Table'
import Select from '@/components/ui/Select';
import React, { ReactElement, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import statesData from '@/utils/states.json'
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { Shop } from '@/interfaces/Shop';
import Link from 'next/link';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';
import { GetServerSideProps } from 'next';
import { makeRequest } from '@/utils/makeRequest';

interface Props {
  shops: Shop[],
  page: number,
  limit: number,
  size: number
}

const Shops = ({ shops, page, limit, size }: Props) => {

  const { push, query, replace } = useRouter()

  const [searchTerm, setSearchTerm] = useState(query.search)

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        push(`/admin/shops?page=1&limit=20`);
      } else {
        push(`/admin/shops?search=${searchTerm}`);
      }
    }, 500),
    [limit]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    debouncedSearch(searchTerm);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Facebook',
      dataIndex: 'facebook',
      key: 'facebook'
    },
    {
      title: 'Instagram',
      dataIndex: 'instagram',
      key: 'instagram'
    },
    {
      title: 'Horario',
      dataIndex: 'schedule',
      key: 'schedule',
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: Shop) => (
        <Link href={`/admin/shops/${record.id}`} className='btn btn-black btn-auto'>Ver</Link>
      )
    },
  ];

  const { register, handleSubmit, reset, formState: { errors }, control, resetField } = useForm();

  const [visible, setVisible] = useState(false)

  const [saving, setSaving] = useState(false)

  const [currentState, setCurrentState] = useState("")

  const onSubmit = async (values: any) => {
    const shop = {
      ...values,
      state: values.state?.value,
      cities: values.cities?.map((city: any) => city.value),
      active: true
    }
    setSaving(true)
    try {
      //await api.post('/api/shops', shop)
      await makeRequest('post', '/api/shops', shop)
      toast.success('Tienda creada')
      setSaving(false)
      reset()
      setVisible(false)
      replace("/admin/shops?page=1&limit=20")
    } catch (error: any) {
      if (error) {
        toast.error(error.response.data.message)
        setSaving(false)
      }
    }
  }

  let states = Object.keys(statesData)

  return (
    <>
      <div className="page">
        <div
          className="pageHeader">
          <h2>Shops  </h2>
          <button onClick={() => {
            setVisible(true)
          }} className="btn btn-pink">Nueva tienda</button>
        </div>
        <div className="pageHeader">
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Buscar tienda...' className='input' type="text" />
        </div>
        {
          query.search &&
          <div className="pageHeader">
            <div
              onClick={() => {
                push(`/admin/shops?page=1&limit=20`);
                setSearchTerm('')
              }}
              className='clear-search'>
              <span>Mostrando resultados para: <b>{query.search}</b></span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        }

        <div className="pageContent">
          <Table
            columns={columns}
            data={shops}
            page={page}
            limit={limit}
            size={size}
            navigateTo='shops'
          />
        </div>
      </div>
      <Modal
        loadingState={saving}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          setVisible(false)
        }}
        title='Nueva tienda'
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        <div>
          <div className="group">
            <Input
              register={register}
              label='Nombre'
              placeholder=''
              name='name'
              errors={errors}
              required
            />
          </div>
          <div className="cardItem">
            <h4>notificaciones de pedidos</h4>
            <span>Al recibir pedidos de las siguientes ubicaciones: </span>
            <div className="group">
              <Select

                options={states.map(item => ({
                  value: item,
                  label: item
                }))}
                errors={errors}
                control={control}
                onChange={async (e: any) => {
                  resetField('cities', {
                    defaultValue: []
                  })
                  setCurrentState(e.value)
                }}
                name='state'
                label='Estado'
              />
            </div>
            <div className="group">
              <Select

                //@ts-ignore
                options={statesData[currentState]?.map((item: string) => ({
                  value: item,
                  label: item
                }))}
                errors={errors}
                control={control}
                name='cities'
                label='Ciudad(es)'
                isMulti
              />
            </div>
            <span>Notificar al siguiente correo:</span>
            <div className="group">
              <Input
                register={register}
                label=''
                placeholder='email@example.com'
                name='email'
                type='email'
                errors={errors}

              />
            </div>
          </div>
          <div className="group">
            <TextArea
              register={register}
              label='Dirección'
              placeholder=''
              name='address'
              required
              errors={errors}
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Teléfono'
              name='phone'
            />
          </div>
          <div className="group">
            <TextArea
              register={register}
              label='Horario'
              placeholder=''
              name='schedule'
              errors={errors}
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Facebook'
              placeholder=''
              name='facebook'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Instagram'
              placeholder=''
              name='instagram'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='X'
              placeholder=''
              name='x'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='TikTok'
              placeholder=''
              name='tiktok'
            />
          </div>
          <div className="group">
            <Input
              register={register}
              label='Link de Google Maps'
              placeholder=''
              name='googleMaps'
            />
          </div>
          <div className="group">
            <input {...register('active')} type="checkbox" name="active" id="active" />
            <label htmlFor="active">Activa</label>
          </div>
        </div>
      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit, search = '' } = query;

  const req = nextReq as any

  let shops = []

  try {
    const { data } = await api.get(`/api/shops?page=${page}&limit=${limit}&search=${search}`, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    shops = data.shops

  } catch (error) {
    console.log({ error })
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      shops,
      page: Number(page),
      limit: Number(limit),
      size: Number(shops.length),
    },
  };
}

Shops.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Shops">
      {page}
    </Layout>
  );
};

export default Shops