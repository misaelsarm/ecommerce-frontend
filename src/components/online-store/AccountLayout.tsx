import Link from 'next/link'
import React, { CSSProperties, ReactNode } from 'react'
import styles from '@/styles/online-store/AccountLayout.module.scss'
import { useRouter } from 'next/router'

interface Props {
  children: ReactNode
}

const accountLinks = [
  {
    path: '/account/profile',
    name: 'Mi perfil'
  },
  {
    path: '/account/orders',
    name: 'Mis pedidos'
  },
  {
    path: '/account/rewards',
    name: 'Mis puntos'
  },
  {
    path: '/account/discounts',
    name: 'Mis descuentos'
  },
  {
    path: '/account/addresses',
    name: 'Direcciones'
  },
  {
    path: '/account/reminders',
    name: 'Recordatorios'
  },
  // {
  //   path: '/account/privacy',
  //   name: 'Privacidad'
  // },
]



const AccountLayout = ({ children }: Props) => {


  const currentLinkStyles: CSSProperties = {
    background: '#ff1b82',
    color: 'white'
  }

  const { pathname } = useRouter()

  return (
    <div className={styles.layout}>
      <div className={styles.links}>
        {
          accountLinks.map(link => (
            <Link
              key={link.path}
              style={pathname.startsWith(link.path) ? currentLinkStyles : undefined}
              href={link.path}
            >
              {link.name}
            </Link>
          ))
        }
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default AccountLayout

/* 
account/profile
account/orders
account/points
account/discounts
account/addresses
account/reminders
account/privacy
*/