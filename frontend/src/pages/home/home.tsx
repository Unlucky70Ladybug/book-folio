import LoggedOutHome from "./logged-out-home"
import BookshelfPage from "../bookshelf/page"
import { useAuth } from "../hooks/use-auth"

const Home = () => {
  const { isLogin } = useAuth()

  return isLogin ? <BookshelfPage /> : <LoggedOutHome />
}

export default Home
