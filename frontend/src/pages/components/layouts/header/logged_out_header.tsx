import { Link } from 'react-router-dom'
import LoginGuestUser from '../../../auth/_components/login-guest-user'

const LoggedOutHeader = () => {
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-8">
      <div className="flex-1">
        <Link to="/" className="text-lg font-medium tracking-wide text-primary">
          BookFolio
        </Link>
      </div>
      <div className="flex-none flex items-center">
        {/* ゲストログイン(お試し用):通常の登録・ログインと区別するため区切り線で離す */}
        <div className="tooltip tooltip-bottom" data-tip="登録せずにお試しできます">
          <LoginGuestUser
            formClassName="flex"
            buttonClassName="btn btn-soft btn-secondary btn-sm sm:btn-md"
            label="ゲストで試す"
          />
        </div>
        <div className="divider divider-horizontal mx-1 sm:mx-3" />
        <div className="flex gap-2">
          <Link to="/signup" className="btn btn-primary btn-sm sm:btn-md">
            新規登録
          </Link>
          <Link to="/login" className="btn btn-outline btn-primary btn-sm sm:btn-md">
            ログイン
          </Link>
        </div>
      </div>
    </header>
  )
}

export default LoggedOutHeader
