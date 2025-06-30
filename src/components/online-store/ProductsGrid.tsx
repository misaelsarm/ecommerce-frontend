import React, { useEffect, useState } from 'react'
import styles from '@/styles/ProductsGrid.module.scss'
import { useRouter } from 'next/router'
import { ProductInterface } from '@/interfaces'
import { ProductItem } from './ProductItem'

interface Props {
  products: ProductInterface[]
}

const ProductsGrid = ({ products: propProducts }: Props) => {

  const [sortBy, setSortBy] = useState('')

  const [tempProducts, setTempProducts] = useState(propProducts)

  const [products, setProducts] = useState(propProducts)

  useEffect(() => {
    setTempProducts(propProducts)
    setProducts(propProducts)
  }, [propProducts])


  const { query: { subcategory } } = useRouter()

  if (sortBy !== '') {
    switch (sortBy) {
      case 'price-ascending':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-descending':
        products.sort((a, b) => b.price - a.price)
        break
      case 'title-ascending':
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'title-descending':
        products.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'created-ascending':
        products.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
        break
      case 'created-descending':
        products.sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf())
        break;
      default:
        products.sort()
        break;
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <span>Ordenar por:</span>
        <select
          onChange={(e) => {
            setSortBy(e.target.value)
          }}
          className='input' name="" id="">
          <option value="">Predeterminado</option>
          <option value="price-ascending">Precio, bajo a alto</option>
          <option value="price-descending">Precio, alto a bajo</option>
          <option value="title-ascending">Alfabetico, A-Z</option>
          <option value="title-descending">Alfabetico, Z-A</option>
          <option value="created-ascending">Fecha, mas recientes</option>
          <option value="created-descending">Fecha, mas antiguos</option>
        </select>
      </div>
      {
        (subcategory === 'active' ||
          subcategory === 'voyager' ||
          subcategory === 'party-cup') &&
        <div className={styles.filters}>
          <span>Filtrar</span>
          <select
            onChange={(e) => {
              const filter = e.target.value
              if (filter === '') return setProducts(tempProducts)
              setProducts(tempProducts.filter(product => product.name.includes(filter)))
            }}
            className='input' name="" id="">
            <option value="">Todos</option>

          </select>
        </div>
      }
      <div className={styles.grid}>
        {
          products.map((product) => (
            <ProductItem
              product={product}
              key={product._id}
            />
          ))
        }
      </div>
    </div>
  )
}

export default ProductsGrid
