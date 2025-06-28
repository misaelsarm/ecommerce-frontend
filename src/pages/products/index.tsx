
import { Layout } from '@/components/online-store/Layout'
import ProductsGrid from '@/components/online-store/ProductsGrid'
import { ProductInterface } from '@/interfaces'
import { makeRequest } from '@/utils/makeRequest'
import { GetServerSideProps } from 'next'
import React from 'react'

interface Props {
  products: ProductInterface[]
}

const ProductsPage = ({ products }: Props) => {
  return (
    <Layout>
      <div className="container-white">
        <h1>Todos los productos</h1>
        <ProductsGrid products={products} />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  let data

  try {
    data = await makeRequest('get', `/api/products?active=true`)
  } catch (error) {

  }

  return {
    props: {
      products: data.products
    }
  }
}

export default ProductsPage