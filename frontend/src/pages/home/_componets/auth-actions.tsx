import { Link } from 'react-router-dom'
import LoginGuestUser from '../../auth/_components/login-guest-user'

// 新規登録・ログイン・ゲストログインのボタン群(ヒーローと締めのCTAで共通)
const AuthActions = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
        <Link to="/signup" className="btn btn-primary btn-lg">
          新規登録
        </Link>
        <Link to="/login" className="btn btn-outline btn-primary btn-lg">
          ログイン
        </Link>
      </div>

      {/* ゲストログイン(お試し用):通常の登録・ログインと区別するため区切り線で離す */}
      <div className="flex flex-col items-center w-full sm:w-auto">
        <div className="divider text-sm opacity-70 w-full sm:w-80 my-1">または</div>
        <LoginGuestUser
          formClassName="flex flex-col items-center w-full sm:w-auto"
          buttonClassName="btn btn-soft btn-secondary btn-lg w-full sm:w-auto"
          label="ゲストで試す"
        />
        <p className="text-xs opacity-60 mt-1">登録せずにお試しできます</p>
      </div>
    </div>
  )
}

export default AuthActions
