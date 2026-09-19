import LoggedInHeader from './logged_in_header'
import LoggedOutHeader from './logged_out_header'
import { useAuth } from '../../../hooks/use-auth'

const Header = () => {
  const { isLogin } = useAuth()

  return isLogin ? <LoggedInHeader /> : <LoggedOutHeader />
}

export default Header
