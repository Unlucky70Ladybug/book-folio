import { useCallback, useContext } from 'react'
import * as authService from '../providers/services/auth'
import { AuthContext } from '../providers/auth-provides'

export const useAuth = () => {
  const { isLogin, currentUser, updateAuthStatus } = useContext(AuthContext)

  const signUp = useCallback(
    async (data: {
      name: string
      email: string
      password: string
      passwordConfirmation: string
    }) => {
      await authService.signup(data)
      await updateAuthStatus()
    },
    [updateAuthStatus],
  )

  // ログイン（仮）
  const login = useCallback(
    async (data: { email: string; password: string }) => {
      await authService.login(data)
      await updateAuthStatus()
    },
    [updateAuthStatus],
  )

  const logout = useCallback(async () => {
    await authService.logout()
    await updateAuthStatus()
  }, [updateAuthStatus])

  return {
    signUp,
    login,
    logout,
    isLogin,
    currentUser,
  }
}
