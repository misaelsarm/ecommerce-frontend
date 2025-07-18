import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LinkInterface } from '@/utils/links';
import { companyData } from '@/utils/companyData';

interface Props {
  links: LinkInterface[]
}

export const Sidebar = ({ links }: Props) => {

  const { asPath } = useRouter()

  const isActive = (path: string) => {
    return asPath.startsWith(path)
  }

  return (
    <div className={styles.sidebar}>
      <>
        <div className={styles.logo}>
          <img src={companyData.companyLogo} alt="" />
        </div>
        <div className={styles.links}>
          {
            links.map(link => (
              <Link
                href={`${link.path}?page=1&limit=20`}
                className={isActive(link.path) ? `${styles.link} ${styles.active}` : styles.link}
              >
                {
                  isActive(link.path) ? link.selectedIcon : link.icon
                }
                <span>{link.name}</span>
              </Link>
            ))
          }
        </div>
      </>
    </div>
  );
};
