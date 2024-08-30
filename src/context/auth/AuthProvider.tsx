import React, { FC, useEffect, useReducer } from 'react'

import { AuthContext } from './AuthContext'
import { authReducer } from './authReducer'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { makeRequest } from '@/utils/makeRequest'
import { UserInterface } from '@/interfaces'

export interface AuthState {
  user: UserInterface,
  loading: boolean
}

interface Props {
  children: JSX.Element
}

const AUTH_INITIAL_STATE: AuthState = {
  user: {} as UserInterface,
  loading: true
}

export const AuthProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

  const { pathname } = useRouter()

  const setUser = (user: UserInterface) => {
    dispatch({ type: 'Auth - Set User', payload: user })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'Auth - Set Loading', payload: loading })
  }

  useEffect(() => {
    async function fetchData() {
      const token = Cookies.get('token')

      if (!token) return

      if (pathname.startsWith('/admin')) {
        try {
          const data = await makeRequest('get', '/api/auth/renew', {}, {
            headers: {
              'x-location': 'admin'
            }
          });
          setUser(data)
          setLoading(false)
        } catch (error: any) {
          setLoading(false)
          toast.error(error.response.data.message)
        }
      } else {
        try {
          const data = await makeRequest('get', '/api/auth/renew');
          setUser(data)
          setLoading(false)
        } catch (error: any) {
          setLoading(false)
          toast.error(error.response.data.message)
        }
      }


    }
    fetchData();
  }, []); // Or [] if effect doesn't need props or state


  return (
    <AuthContext.Provider value={{
      ...state,
      setUser,
      setLoading
    }}>
      {
        children
      }
    </AuthContext.Provider>
  )
}
