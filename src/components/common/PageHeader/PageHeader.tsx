import React, { ChangeEventHandler, MouseEventHandler, useContext, useState } from 'react'
import { AuthContext } from '@/context/auth/AuthContext'
import { hasPermission } from '@/utils/hasPermission'
import { useRouter } from 'next/router'
import Input from '../Input/Input'
import Button from '../Button/Button'
import Fab from '../Fab/Fab'
import FabGroup from '../FabGroup/FabGroup'
import styles from './PageHeader.module.scss'

interface Action {
  name: string,
  onClick: MouseEventHandler,
  className?: string
  public?: boolean;
}

interface Props {
  title: string,
  actions?: Action[]
  handleSearch: ChangeEventHandler<HTMLInputElement>
  searchQuery: any,
  onClearSearch: any
  searchTerm: any
}

const PageHeader = ({ title, actions = [], handleSearch, searchTerm, searchQuery, onClearSearch }: Props) => {

  const { user } = useContext(AuthContext)

  const { pathname } = useRouter()

  const [visible, setVisible] = useState(false)

  const canCreateEdit = user.role === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderTop}>
        <div className={styles.pageHeaderTitle}>
          <h2>{title}</h2>
        </div>
        {
          actions?.length > 0 && (
            <div className={styles.pageHeaderActions}>
              {
                actions
                  .filter(action => action.public || canCreateEdit)
                  .map(action => (
                    <Button
                      key={action.name}
                      onClick={action.onClick}
                      className={action.className || 'btn btn-primary'}
                    >
                      {action.name}
                    </Button>
                  ))
              }
            </div>
          )
        }
      </div>
      <div className={styles.pageHeaderBottom}>
        <div className={styles.pageHeaderSearch}>
          <Input
            placeholder='Search...'
            onChange={handleSearch}
            value={searchTerm}
          />
          {
            searchQuery &&
            <div className="pageHeader">
              <div
                onClick={onClearSearch}
                className='clear-search'>
                <span>Showing results for: <b>{searchQuery}</b></span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          }
        </div>
      </div>
      {
        actions?.length > 0 && (
          <FabGroup>
            {
              visible && actions
                .filter(action => action.public || canCreateEdit)
                .map(action => (
                  <Fab
                    actionName={action.name}
                    onClick={action.onClick}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>}
                  />
                ))
            }
            <Fab
              onClick={() => setVisible(!visible)}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>}
            />
          </FabGroup>
        )
      }
    </div >
  )
}

export default PageHeader