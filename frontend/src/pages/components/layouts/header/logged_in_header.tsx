import { Link } from "react-router-dom";

const LoggedInHeader = () => {
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
            className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span>U</span>
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
                <Link to="/logout">ログアウト</Link>
              </li>
            </ul>
          </div>
      </div>
    </header>
  );
};

export default LoggedInHeader;
