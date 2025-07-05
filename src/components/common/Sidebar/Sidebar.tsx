import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LinkInterface } from '@/utils/links';
import { classNames } from '@/utils/css';

interface Props {
  links: LinkInterface[]
}

export const Sidebar = ({ links }: Props) => {

  const { pathname } = useRouter()

  const isActive = (currentPath: string) => {
    if (pathname.includes(currentPath)) {
      return styles.active
    }
    return ''
  }

  const className = classNames(
    styles.link
  )

  return (
    <div className={styles.sidebar}>
      <>
        <div className={styles.logo}>
          <img src="/logo.png" alt="" />
        </div>
        <div className={styles.links}>
          {
            links.map(link => (
              <Link
                href={`${link.path}?page=1&limit=20`}
                className={`${className} ${isActive(link.path)}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))
          }
        </div>
      </>
    </div>
  );
};
