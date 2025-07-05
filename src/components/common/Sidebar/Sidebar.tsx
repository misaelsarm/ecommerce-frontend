import { CSSProperties } from 'react';
import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LinkInterface } from '@/utils/links';

interface Props {
  links: LinkInterface[]
}

export const Sidebar = ({ links }: Props) => {

  const { pathname } = useRouter()

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
            links.map(link => (
              <div key={link.name}>
                <Link
                  style={pathname.includes(link.path) ? style : undefined}
                  href={`${link.path}?page=1&limit=20`}
                  className={styles.link}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </div>
            ))
          }
        </div>
      </>
    </div>
  );
};
