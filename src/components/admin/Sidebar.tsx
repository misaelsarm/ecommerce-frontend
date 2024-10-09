import { CSSProperties, useContext, useEffect, useState } from 'react';
import { LinkInterface, links } from '@/utils/links';
import styles from '@/styles/admin/Sidebar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/auth/AuthContext';

const Sidebar = () => {

  const { asPath } = useRouter();

  const { user, loading } = useContext(AuthContext);

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

  // Styling for active links
  const style: CSSProperties = {
    color: 'white',
    background: 'black',
  };

  return (
    <div className={styles.sidebar}>
      {
        loading ? 'Loading...' : <>
          <div className={styles.logo}>
            <img src="/logo.png" alt="" />
          </div>
          <div className={styles.links}>
            {filtered.map(link => (
              <div key={link.name}>
                <Link
                  style={asPath.includes(link.path) ? style : undefined}
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
                        style={asPath.includes(sub.path) ? style : undefined}
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
            ))}
          </div>
        </>
      }
    </div>
  );
};

export default Sidebar;
