import React, { createContext, useCallback, useEffect, useState } from 'react'
import * as authService from '../providers/services/auth'
import { type CuurentUser } from '../../types/user'

type Props = {
  children: React.ReactNode
}

// AuthContextはAuthProviderが呼び出されると、最後に.
// AuthContext.Providerとして自動で呼ばれる.
export const AuthContext = createContext<{
  isLogin: boolean | null
  currentUser: CuurentUser | null
  updateAuthStatus: () => Promise<void>
}>({
  isLogin: false,
  currentUser: null,
  updateAuthStatus: async () => {},
})

export const AuthProvider = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<CuurentUser | null>(null)

  const updateAuthStatus = useCallback(async () => {
    const user = await authService.fetchCurrentUser()
    setIsLogin(!!user)
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    updateAuthStatus()
  }, [updateAuthStatus])

  return (
    <AuthContext.Provider value={{ isLogin, currentUser, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  )
}
