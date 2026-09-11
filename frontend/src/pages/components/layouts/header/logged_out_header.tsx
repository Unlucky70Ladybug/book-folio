import { Link } from "react-router-dom";

const LoggedOutHeader = () => {
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-8">
      <div className="flex-1">
        <Link
          to="/"
          className="rounded-full px-4 py-1.5 text-lg font-medium tracking-wide text-primary"
        >
          BookFolio
        </Link>
      </div>
      <div className="flex-none">
          <div className="flex gap-2">
            <Link to="/signup" className="btn btn-primary btn-sm sm:btn-md">
              新規登録
            </Link>
            <Link
              to="/login"
              className="btn btn-outline btn-primary btn-sm sm:btn-md"
            >
              ログイン
            </Link>
          </div>
      </div>
    </header>
  );
};

export default LoggedOutHeader;
