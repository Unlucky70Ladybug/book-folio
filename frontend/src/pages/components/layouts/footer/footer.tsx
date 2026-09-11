import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-between bg-base-100 border-t border-base-300 px-4 sm:px-8 py-4">
      {/* 左端 */}
      <div>
        <Link
          to="/"
          className="text-lg font-medium tracking-wide text-primary"
        >
          BookFolio
        </Link>
      </div>

      {/* 右端 */}
      <div>
        {/* Rakuten Web Services Attribution Snippet FROM HERE */}
        <a href="https://developers.rakuten.com/" target="_blank">Supported by Rakuten Developers</a>
        {/* Rakuten Web Services Attribution Snippet FROM HERE */}
      </div>
    </footer>
  );
};

export default Footer;
