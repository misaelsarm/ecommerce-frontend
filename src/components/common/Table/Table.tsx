import { CSSProperties, useState } from 'react'
import styles from './Table.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '../Button/Button'

interface Props {
  columns: any[]
  data: any[],
  style?: CSSProperties,
  limit: number,
  page?: number,
  navigateTo?: string,
  batchSize: number,
  totalRecords: number
  loading?: boolean,
  showButtons?: boolean
  paramKey: string
}

export const Table = ({ data, columns, style, page = 0, limit = 0, navigateTo, batchSize, totalRecords, showButtons = true, paramKey }: Props) => {

  const [sortConfig, setSortConfig] = useState<any>(null);

  const { push } = useRouter()

  const styling: CSSProperties = {
    transform: sortConfig?.direction === 'ascending' ? `rotate(180deg)` : 'rotate(0)'
  }

  let sortedProducts = [...data];

  if (sortConfig !== null) {

    const sortConfigDetails: any[] = sortConfig.key.split('.')

    if (sortConfigDetails.length === 2) {


      sortedProducts.sort((a, b) => {

        const recordA = a[sortConfigDetails[0]][sortConfigDetails[1]]
        const recordB = b[sortConfigDetails[0]][sortConfigDetails[1]]

        if (recordA < recordB) {

          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (recordA > recordB) {

          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      })
    } else {
      sortedProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
  }

  const requestSort = (key: string, sortBy?: string) => {

    let direction = 'ascending';
    if ((sortConfig?.key === key || sortConfig?.key === sortBy) && sortConfig?.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key: sortBy || key, direction });
  }

  const currentPage = page || 1

  const totalPages = !limit || totalRecords === 0 ? 1 : Math.ceil(totalRecords / limit)

  return (
    <div style={{ ...style }} className={styles.table}>
      <div className={styles.header}>
        {
          columns?.map((col: any) => (
            <div
              onClick={() => {
                requestSort(col.dataIndex, col.sortBy)
              }}
              key={col.title}
              className={styles.col}
            >
              <span>
                {col.title}
              </span>
              <svg
                style={sortConfig?.key === col.dataIndex ? styling : undefined}
                xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ))
        }
      </div>
      {
        sortedProducts?.map((item: any, index: number) => (
          <Link href={`/${navigateTo}/${item[paramKey]}`} key={index} className={styles.row}>
            {
              columns.map((col: any, index: number) => {
                return (
                  <div key={index} className={styles.col}>
                    <div className={styles.colTitle}>
                      {
                        col.title
                      }
                    </div>
                    {
                      ('render' in col) ?
                        <div title={item[col.dataIndex]}>
                          {col.render(item[col.dataIndex], item)}
                        </div> :
                        <span title={item[col.dataIndex]} className={styles.fontSmall}>{item[col.dataIndex]}</span>
                    }
                  </div>
                )
              })
            }
          </Link>
        )
        )
      }
      {
        sortedProducts?.length === 0 &&
        <div className={styles.empty}>
          <img src="/empty-folder.png" alt="" />
          <span>No hay registros</span>
        </div>
      }
      {
        <div className={styles.footer}>
          <span>
            Página {currentPage}/{totalPages}
          </span>
          <div className={styles.buttons}>
            <Button
              onClick={() => {
                push(`/${navigateTo}?page=${currentPage - 1}&limit=${limit}`);
              }}
              disabled={currentPage <= 1} // Disable when on the first page
            >
              Anterior
            </Button>
            <Button
              onClick={() => {
                push(`/${navigateTo}?page=${currentPage + 1}&limit=${limit}`);
              }}
              disabled={currentPage >= totalPages} // Disable when on the last page
            >
              Siguiente
            </Button>
          </div>
        </div>
      }
    </div>
  )
}