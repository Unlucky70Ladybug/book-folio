import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth'

const PrivateRoute = () => {
  const { isLogin } = useAuth()

  // ログインしていれば子画面を表示し、ログインしていなければログイン画面へリダイレクトする.
  return isLogin ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
