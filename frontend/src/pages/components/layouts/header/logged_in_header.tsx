import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/use-auth'
import BookSearchForm from '../../../search_books/_components/book-search-form'
import defaultUserImage from '../../../../assets/default_user_image.png'

const LoggedInHeader = () => {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()
  const [isSecondRowVisible, setIsSecondRowVisible] = useState(true)

  // ヘッダーの動き設定
  useEffect(() => {
    const SCROLL_THRESHOLD = 10
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const delta = currentScrollY - lastScrollY

        if (currentScrollY <= 0) {
          setIsSecondRowVisible(true)
        } else if (Math.abs(delta) > SCROLL_THRESHOLD) {
          setIsSecondRowVisible(delta < 0)
        }

        lastScrollY = currentScrollY
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 mb-12 border-b border-base-300 bg-base-100">
      <div className="navbar relative z-10 bg-base-100 px-4 sm:px-8">
        <div className="flex-1">
          <Link
            to="/"
            className="text-lg font-medium tracking-wide text-primary"
          >
            BookFolio
          </Link>
        </div>

        <div className="flex flex-none items-center gap-2">
          <BookSearchForm />

          <Link to="/bookshelf" className="btn btn-ghost btn-sm">
            本棚
          </Link>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={currentUser?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-1 mt-3 w-48 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <Link to="/mypage">マイページ</Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>
                  ログアウト
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        inert={!isSecondRowVisible}
        aria-hidden={!isSecondRowVisible}
        className={`absolute inset-x-0 top-full flex h-12 items-center gap-2 border-y border-base-300 bg-base-100 px-4 sm:px-8 transition-transform duration-300 ease-out ${
          isSecondRowVisible ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
        }`}
      >
        <Link to="/genre-statistic" className="btn btn-ghost btn-sm">
          読書分析
        </Link>

        <Link to="/preference" className="btn btn-ghost btn-sm">
          好み診断
        </Link>
      </div>
    </header>
  )
}

export default LoggedInHeader
