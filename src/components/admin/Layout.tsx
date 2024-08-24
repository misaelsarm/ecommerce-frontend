import Sidebar from './Sidebar'
import styles from '@/styles/admin/Layout.module.scss'
import { FC, useContext, useState } from 'react'
import TabBar from './TabBar'
//import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
//import { AuthContext } from '@/context/auth/AuthContext'
//import { User } from '@/interfaces'
import Head from 'next/head'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import Cookies from 'js-cookie'

interface Props {
  title: string
  children: JSX.Element | JSX.Element[]
}

const Layout: FC<Props> = ({ children, title }) => {

  const [visible, setVisible] = useState(false)

  const windowWidth = useWindowWidth()

  const { replace } = useRouter()

  //const { user, setUser } = useContext(AuthContext)

  return (
    <>
      <Head>
        <title>{`Norday | ${title}`}</title>
      </Head>
      {
        windowWidth && windowWidth >= 768 ?
          <Sidebar /> : <TabBar />
      }

      <div className="topBar">
        <div className="menuWrapper">
          <div onClick={() => {
            setVisible(!visible)
          }} className="menu">
            {/* {user.name} */}
            misael sarmiento
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {
            visible &&
            <div className="menuOverlay">
              <span
                onClick={() => {
                  setVisible(false)
                  Cookies.remove('token')
                  replace('/admin/login')
                  // setUser({} as User)
                }}
              > Cerrar sesión</span>
            </div>
          }
        </div>
      </div>
      <div className={styles.mainContent}>
        {children}
      </div>
    </>
  )
}

export default Layout