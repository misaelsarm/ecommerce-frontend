import { Layout } from '@/components/online-store/Layout'
import ProductsGrid from '@/components/online-store/ProductsGrid'
import { ProductInterface } from '@/interfaces'
import { makeRequest } from '@/utils/makeRequest'
import { GetServerSideProps } from 'next'
import React, { ReactElement } from 'react'

interface Props {
  products: ProductInterface[]
}

const ProductsPage = ({ products }: Props) => {
  return (
    <div className="container-white">
      <h1>Todos los productos</h1>
      <ProductsGrid products={products} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  let data

  try {
    data = await makeRequest('get', `/api/public/products?active=true`)
  } catch (error) {
    console.log({ error })
  }

  return {
    props: {
      products: data.products
    }
  }
}

ProductsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Productos">
      {page}
    </Layout>
  );
};

export default ProductsPage