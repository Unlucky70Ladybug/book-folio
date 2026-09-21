import Cookies from 'js-cookie'

/* sinupメソッド */
export const signup = async (data: {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  avatarImage: File | null
}) => {
  /* confirm_success_urlはユーザー入力ではなく自オリジンから固定で組み立てる(オープンリダイレクト対策) */
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('email', data.email)
  formData.append('password', data.password)
  formData.append('password_confirmation', data.passwordConfirmation)
  formData.append('confirm_success_url', import.meta.env.VITE_FRONTEND_URL)
  if (data.avatarImage) {
    formData.append('avatar_image', data.avatarImage)
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
    method: 'POST',
    body: formData,
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json?.errors?.full_messages?.[0] || '新規登録に失敗しました')
  }

  return json
}

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign_in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.errors?.[0] || 'ログインに失敗しました')

  Cookies.set('_access_token', res.headers.get('access-token') ?? '')
  Cookies.set('_client', res.headers.get('client') ?? '')
  Cookies.set('_uid', res.headers.get('uid') ?? '')

  return json
}

export const logout = async () => {
  await fetch('/api/v1/sessions', {
    method: 'DELETE',
    headers: {},
    credentials: 'include',
  })
}

export const fetchCurrentUser = async () => {
  if (!Cookies.get('_access_token') || !Cookies.get('_client') || !Cookies.get('_uid')) {
    return
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sessions`, {
    headers: {
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return data.user ?? null
}
