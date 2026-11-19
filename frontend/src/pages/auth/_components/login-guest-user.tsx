import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth'

const LoginGuestUser = () => {
  const { gestUserlogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await gestUserlogin()
      navigate('/bookshelf')
    } catch (err) {
      console.error('Request failed', err)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card my-8 w-full border border-base-300 bg-base-100 shadow-lg"
    >

        <button type="submit" className="btn btn-primary btn-lg mt-2 w-full">
          ゲストユーザーでログイン
        </button>
    </form>
  )
}

export default LoginGuestUser
