import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Cookies from 'js-cookie'
import styles from '@/styles/admin/Layout.module.scss'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { LinkInterface, links } from '@/utils/links'
import { useAuthStore } from '@/store/auth'
import { Sidebar, TabBar } from '../common'
import { companyData } from '@/utils/companyData'
import { useThemeStore } from '@/store/theme'


interface Props {
  title: string
  children: JSX.Element | JSX.Element[]
}

const Layout = ({ children, title }: Props) => {

  const setTheme = useThemeStore((state) => state.setTheme)

  const currentTheme = useThemeStore((state) => state.theme)

  const [visible, setVisible] = useState(false)

  const windowWidth = useWindowWidth()

  const { replace } = useRouter()

  const user = useAuthStore(state => state.user)

  // Extract pages from user permissions
  const pages = user.permissions?.map(item => item.page);

  // State for filtered links
  const [filtered, setFiltered] = useState<LinkInterface[]>([]);

  useEffect(() => {
    if (user.role === 'admin') {
      // Admin has access to all links
      setFiltered(links);
    } else {
      // Filter main links based on user permissions
      const filteredLinks = links.filter(link => pages?.includes(link.path));
      setFiltered(filteredLinks);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>{`${companyData.company} | ${title}`}</title>
      </Head>
      {
        windowWidth && windowWidth >= 768 ?
          <Sidebar links={filtered} /> : <TabBar links={filtered} />
      }


      <div className="topBar">
        <button onClick={() => setTheme(currentTheme.name === 'light' ? 'dark' : 'light')}>
          Switch to {currentTheme.name === 'light' ? 'Dark' : 'Light'} Mode
        </button >
        <div className="menuWrapper">
          <div onClick={() => {
            setVisible(!visible)
          }} className="menu">
            {user.name}
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
                  Cookies.remove('user_meta')
                  replace('/admin/login')
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