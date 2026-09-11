import LoggedInHeader from "./logged_in_header";
import LoggedOutHeader from "./logged_out_header";

type HeaderProps = {
  isLoggedIn?: boolean;
};

const Header = ({ isLoggedIn = false }: HeaderProps) => {
  return  isLoggedIn ? <LoggedInHeader /> : <LoggedOutHeader />;
};

export default Header;
