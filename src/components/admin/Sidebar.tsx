import { CSSProperties } from 'react'
import { links } from '@/utils/links'
import styles from '@/styles/admin/Sidebar.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {

  const { asPath } = useRouter()

  const style: CSSProperties = {
    color: 'white',
    background: 'black'
  }

  return (
    <div className={`${styles.sidebar} sidebar`}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="" />
      </div>
      <div className={styles.links}>
        {
          links.map(link => (
            <div key={link.name}>
              <Link
                style={asPath.includes(link.root) ? style : undefined}
                href={`${link.path}?page=1&limit=20`}
                className={styles.link}
              >
                {link.icon}
                <span>
                  {link.name}
                </span>
              </Link>
              <div className={styles.sub}>
                {
                  link.sub.map(sub => (
                    <Link
                      style={asPath.includes(sub.path) ? style : undefined}
                      key={sub.name}
                      href={`${sub.path}?page=1&limit=20`}
                      className={styles.link}
                    >
                      <span>
                        {sub.name}
                      </span>
                    </Link>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    </div >
  )
}

export default Sidebar
