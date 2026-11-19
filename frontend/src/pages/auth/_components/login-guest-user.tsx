import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth'

type Props = {
  formClassName?: string
  buttonClassName?: string
  label?: string
}

const LoginGuestUser = ({
  formClassName,
  buttonClassName,
  label = 'ゲストユーザーでログイン',
}: Props) => {
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
    <form onSubmit={handleSubmit} className={formClassName}>
      <button type="submit" className={buttonClassName}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
        </svg>
        {label}
      </button>
    </form>
  )
}

export default LoginGuestUser
