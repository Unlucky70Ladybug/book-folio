import { useCallback, useContext } from 'react'
import * as authService from '../providers/services/auth'
import { AuthContext } from '../providers/auth-provides'
import { NotificationContext } from '../providers/notification-provider'

export const useAuth = () => {
  const { isLogin, currentUser, updateAuthStatus } = useContext(AuthContext)
  const { notify } = useContext(NotificationContext)

  const signUp = useCallback(
    async (data: {
      name: string
      email: string
      password: string
      passwordConfirmation: string
      avatarImage: File | null
    }) => {
      try {
        await authService.signup(data)
        await updateAuthStatus()
        notify('メールを送りました', 'success')
      } catch (err) {
        notify(err instanceof Error ? err.message : '新規登録に失敗しました', 'error')
        throw err
      }
    },
    [updateAuthStatus, notify],
  )

  // ログイン（仮）
  const login = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        await authService.login(data)
        await updateAuthStatus()
        notify('ログインに成功しました', 'success')
      } catch (err) {
        notify(err instanceof Error ? err.message : 'ログインに失敗しました', 'error')
        throw err
      }
    },
    [updateAuthStatus, notify],
  )

  const logout = useCallback(async () => {
    try {
      await authService.logout()
      await updateAuthStatus()
      notify('ログアウトに成功しました', 'info')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'ログアウトに失敗しました', 'error')
    }
  }, [updateAuthStatus])

  return {
    signUp,
    login,
    logout,
    isLogin,
    currentUser,
  }
}
