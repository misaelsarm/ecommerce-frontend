import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from '@/styles/Nav.module.scss'
import { useUIStore } from '@/store/ui'

const Nav = () => {

  const [visible, setVisible] = useState(false)

  const collections = useUIStore(state => state.collections)

  return (
    <>
      <div className={styles.wrapper}>
        <nav className={styles.nav}>
          <Link className={styles.logo} href='/'>
            <Image
              src='/logo-blanco-2022.png'
              width={100}
              height={100}
              alt='Logo de Globemily'
            />
          </Link>
          <div className={styles.links}>
            <Link href='/'>
              Inicio
            </Link>
            <Link href='/products'>
              Todos
            </Link>
            {
              collections?.map(collection => (
                <Link key={collection._id} href={`/collections/${collection.code}`}>
                  {collection.name}
                </Link>
              ))
            }
          </div>
          <div className={styles.icons}>
            <Link
              href='/search'
              className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href='/account/profile'
              className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link className={styles.icon} href='/cart' >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            <div
              onClick={() => {
                setVisible(true)
              }}
              className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>
        </nav>
      </div>
      {
        visible && 'Drawer'
      }

      {/* <Drawer
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
      /> */}
    </>
  )
}

export default Nav