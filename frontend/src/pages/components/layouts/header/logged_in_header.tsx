import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/use-auth";
import defaultUserImage from "../../../../assets/default_user_image.png";

const LoggedInHeader = () => {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-8">
      <div className="flex-1">
        <Link
          to="/"
          className="rounded-full bg-primary/10 px-4 py-1.5 text-lg font-medium tracking-wide text-primary"
        >
          BookFolio
        </Link>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
            >
              <div className="rounded-full w-10">
                <img src={currentUser?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-48 p-2 shadow"
            >
              <li>
                <Link to="/mypage">マイページ</Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>ログアウト</button>
              </li>
            </ul>
          </div>
      </div>
    </header>
  );
};

export default LoggedInHeader;
