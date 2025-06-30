import { CSSProperties } from 'react';
import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LinkInterface } from '@/utils/links';
import { Skeleton } from '../Skeleton/Skeleton';
import { useAuthStore } from '@/store/auth';

interface Props {
  links: LinkInterface[]
}

const Sidebar = ({ links }: Props) => {

  const { pathname } = useRouter()

  const loading = useAuthStore(state => state.loading);

  // Styling for active links
  const style: CSSProperties = {
    color: 'white',
    background: 'black',
  };

  return (
    <div className={styles.sidebar}>
      <>
        <div className={styles.logo}>
          <img src="/logo.png" alt="" />
        </div>
        <div className={styles.links}>
          {
            loading ? [1, 2, 3, 4, 5, 6, 7].map(item => (
              <Skeleton width='100%' height='30px' style={{ marginBottom: 5 }} />
            )) : links.map(link => (
              <div key={link.name}>
                <Link
                  style={pathname.includes(link.path) ? style : undefined}
                  href={`${link.path}?page=1&limit=20`}
                  className={styles.link}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
                {link.sub.length > 0 && (
                  <div className={styles.sub}>
                    {link.sub.map(sub => (
                      <Link
                        style={pathname.includes(sub.path) ? style : undefined}
                        key={sub.name}
                        href={`${sub.path}?page=1&limit=20`}
                        className={styles.link}
                      >
                        <span>{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </>
    </div>
  );
};

export default Sidebar;
