import { links } from '@/utils/links'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import styles from '../../styles/admin/TabBar.module.scss'

const TabBar = () => {

  const { pathname } = useRouter()

  const [menuVisible, setMenuVisible] = useState(false)

  const firstFive = links.slice(0, 4)
  const last = links.slice(4)

  return (
    <div>
      <div
        className={styles.tabBar}
      >
        {
          firstFive.map(link => (
            <Link key={link.path}
              className={
                link.path.includes(pathname) ? `${styles.link} ${styles.active}` : styles.link}
              href={`${link.path}?page=1&limit=20`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))
        }
        {
          links.length > 4 &&
          <div
            onClick={() => {
              setMenuVisible(!menuVisible)
            }}
            className={styles.link} >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Ver más</span>
          </div>
        }
      </div>
      {
        menuVisible &&
        <div
          className={styles.menu}>
          {
            last.map(link => (
              <Link
                key={link.path}
                onClick={() => {
                  setMenuVisible(false)
                }}
                href={`${link.path}?page=1&limit=20`}
                className={styles.menuLink}
              >
                <span>{link.name}</span>
              </Link>
            ))
          }
        </div>
      }
    </div>
  )
}

export default TabBar