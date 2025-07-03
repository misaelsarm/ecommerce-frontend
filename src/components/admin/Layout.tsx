import Sidebar from '../common/Sidebar/Sidebar'
import styles from '@/styles/admin/Layout.module.scss'
import { FC, useEffect, useState } from 'react'
import TabBar from '../common/TabBar/TabBar'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import Cookies from 'js-cookie'
import { LinkInterface, links } from '@/utils/links'
import { useAuthStore } from '@/store/auth'
import { Skeleton } from '../common/Skeleton/Skeleton'

interface Props {
  title: string
  children: JSX.Element | JSX.Element[]
}

const Layout: FC<Props> = ({ children, title }) => {

  const [visible, setVisible] = useState(false)

  const windowWidth = useWindowWidth()

  const { replace } = useRouter()

  const user = useAuthStore(state => state.user)

  const loading = useAuthStore(state => state.loading)

  console.log({ loading })

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

      // Filter sub-links based on user permissions
      const filteredLinksWithSub = filteredLinks.map(link => ({
        ...link,
        sub: link.sub.filter(sub => pages?.includes(sub.path)),
      }));

      setFiltered(filteredLinksWithSub);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>{`Norday | ${title}`}</title>
      </Head>
      {
        windowWidth && windowWidth >= 768 ?
          <Sidebar links={filtered} /> : <TabBar links={filtered} />
      }
      <div className="topBar">
        <div className="menuWrapper">
          {
            loading ? <Skeleton width='150px' height='20px' /> :
              <div onClick={() => {
                setVisible(!visible)
              }} className="menu">
                {user.name}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
          }
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