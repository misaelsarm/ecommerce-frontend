import React, { ChangeEventHandler, useContext } from 'react'
import Input from '../common/Input'
import { AuthContext } from '@/context/auth/AuthContext'
import { hasPermission } from '@/utils/hasPermission'
import { useRouter } from 'next/router'

interface Props {
  title: string,
  actions: any[]
  handleSearch: ChangeEventHandler<HTMLInputElement>
  searchQuery: any,
  onClearSearch: any
  searchTerm: any
}

const PageHeader = ({ title, actions, handleSearch, searchTerm, searchQuery, onClearSearch }: Props) => {

  const { user } = useContext(AuthContext)

  const { push, query, replace, pathname } = useRouter()

  const canCreateEdit = user.role?.value === 'admin' ? true : hasPermission(pathname, 'create-edit', user.permissions)

  return (
    <div className='pageHeader'>
      <div className="pageHeaderTop">
        <div className='pageHeaderTitle'>
          <h2>{title}</h2>
        </div>
        {
          canCreateEdit &&
          <div className='pageHeaderActions'>
            {
              actions.map(action => (
                <button
                  key={action.name}
                  onClick={action.onClick}
                  className='btn btn-black'
                >{action.name}
                </button>
              ))
            }
          </div>
        }
      </div>
      <div className="pageHeaderBottom">
        <div className='pageHeaderSearch'>
          <Input
            placeholder='Buscar...'
            onChange={handleSearch}
            value={searchTerm}
          />
          {
            searchQuery &&
            <div className="pageHeader">
              <div
                onClick={onClearSearch}
                className='clear-search'>
                <span>Mostrando resultados para: <b>{searchQuery}</b></span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default PageHeader