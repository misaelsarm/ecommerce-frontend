import React, { MouseEventHandler } from 'react'
import styles from './Page.module.scss'
import { useRouter } from 'next/router';
import { Button, Input } from '../';

interface Action {
  name: string,
  onClick: MouseEventHandler,
  className?: string
  public?: boolean;
}
interface Props {
  children?: React.ReactNode
  title?: string
  primaryAction?: Action
  seconDaryActions?: Action[]
  backAction?: boolean,
  fullWidth?: boolean
  maxwidth?: string
  search?: {
    searchTerm: string | string[] | undefined,
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onClearSearch?: () => void
  }
}

export const Page = ({
  children,
  title,
  primaryAction,
  seconDaryActions,
  backAction,
  fullWidth = true,
  maxwidth,
  search

}: Props) => {

  const { back } = useRouter()

  return (
    <div className={styles.pageWrapper}>
      <div
        style={
          fullWidth ? {} : { maxWidth: maxwidth || '1200px', margin: '0 auto' }
        }
        className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderTop}>
            <div className={styles.pageHeaderLeft}>
              {
                backAction &&
                <button
                  onClick={back}
                  className={styles.backAction}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              }
              <div className={styles.pageHeaderTitle}>
                <h2>{title}</h2>
              </div>
            </div>
            <div className={styles.pageHeaderRight}>
              <div className={styles.pageHeaderActions}>
                {
                  primaryAction &&
                  <div className="primaryAction">
                    <Button
                      key={primaryAction.name}
                      onClick={primaryAction.onClick}
                      className={primaryAction.className || 'btn btn-primary'}
                    >
                      {primaryAction.name}
                    </Button>
                  </div>
                }
                {
                  seconDaryActions && seconDaryActions.length > 0 &&
                  <div className={styles.secondaryActions}>
                    {
                      seconDaryActions
                        .filter(action => action.public)
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
                }
              </div>
            </div>
          </div>
          <div className={styles.pageHeaderBottom}>
            {
              search &&
              <div className={styles.pageHeaderSearch}>
                <Input
                  placeholder='Buscar...'
                  onChange={search.handleSearch}
                  value={search.searchTerm as string}
                />
                {
                  search.searchTerm &&
                  <div
                    onClick={search.onClearSearch}
                    className='clear-search'>
                    <span>Mostrando resultados para: <b>{search.searchTerm}</b></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>

                }
              </div>
            }
          </div>
          {/*         {
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
        } */}
        </div >
        <div className='pageContent'>
          {children}
        </div>
      </div>
    </div>
  )
}