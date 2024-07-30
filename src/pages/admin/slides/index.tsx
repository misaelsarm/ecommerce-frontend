import Layout from '@/components/admin/Layout'
import React, { ReactElement, useState } from 'react'
import { Slide } from '@/interfaces'
import Link from 'next/link'
import Table from '@/components/admin/Table'
import { GetServerSideProps } from 'next'
import { makeRequest } from '@/utils/makeRequest'
import { AddSlide } from '@/components/admin/AddSlide'
import { useRouter } from 'next/router'

interface Props {
  slides: Slide[]
  page: number,
  limit: number,
  size: number
}

const SlidesAdminPage = ({ slides, page, limit, size }: Props) => {

  const { replace } = useRouter()

  const [visible, setVisible] = useState(false)

  const headers = [
    {
      title: 'Imagen Web',
      dataIndex: 'image',
      key: 'image',
      render: (_text: string, record: Slide) =>
        <img style={{ width: 100 }} src={record.images?.web} />

    },
    {
      title: 'Imagen movil',
      dataIndex: 'image',
      key: 'image',
      render: (_text: string, record: Slide) =>
        <img style={{ width: 100 }} src={record.images?.mobile} />

    },
    {
      title: 'Posición',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: 'Redirige a',
      dataIndex: 'ctaRedirect',
      key: 'ctaRedirect'
    },
    {
      title: 'Activa',
      dataIndex: 'active',
      key: 'active',
      render: (_text: string, record: any) => record.active ? 'Si' : 'No'
    },
    {
      title: 'Detalles',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (_text: string, record: any) => <Link href={`/admin/slides/${record.id}`} className='btn btn-black btn-auto'>Ver</Link>
    }
  ]

  return (
    <>
      <div className='page'>
        <div className='pageHeader'>
          <h2>Slides</h2>
          <button onClick={() => {
            setVisible(true)
          }} className="btn btn-pink">Nueva slide</button>
        </div>
        <Table
          page={page}
          limit={limit}
          columns={headers}
          data={slides}
          size={size}
          navigateTo='slides'
        />
      </div>
      <AddSlide
        visible={visible}
        setVisible={setVisible}
        onOk={() => {
          setVisible(false)
          replace('/admin/slides?page=1&limit=20')
        }}
      />
    </>
  )
}

SlidesAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Slides">
      {page}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req: nextReq, query }) => {

  const { page, limit = '' } = query;

  const req = nextReq as any

  let slides = []

  try {
    const data = await makeRequest('get', `/api/slides?page=${page}&limit=${limit}`, {}, {
      headers: {
        //@ts-ignore
        "x-access-token": req.headers.cookie ? req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')).split('=')[1] : null,
        "x-location": "admin"
      }
    })
    slides = data.slides

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
      slides,
      page: Number(page),
      limit: Number(limit),
      size: Number(slides.length),
    },
  };
}

export default SlidesAdminPage