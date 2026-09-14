const getCSRFToken = () =>
  document.querySelector("meta[name='csrf-token']")?.getAttribute('content') ||
  ''

/* sinupメソッド */
export const signup = async (data: {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    /* json型にする */
    /* confirm_success_urlはユーザー入力ではなく自オリジンから固定で組み立てる(オープンリダイレクト対策) */
    body: JSON.stringify({
      ...data,
      confirm_success_url: window.location.origin
    }),
  })

  const text = await res.text();

  console.log("status:", res.status);
  console.log("body:", text);

  if (!res.ok) {
    throw new Error(text);
  }

  return text ? JSON.parse(text) : null;

  // const json = await res.json()
  // if (!res.ok) {
  //   throw new Error(json?.error || '新規登録に失敗しました')
  // }

  // return json
}

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch('/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCSRFToken(),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'ログイン失敗')

  return json
}

export const logout = async () => {
  await fetch('/api/v1/sessions', {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': getCSRFToken(),
    },
    credentials: 'include',
  })
}

export const fetchCurrentUser = async () => {
  const res = await fetch(`/api/v1/me`, {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return data.user || null
}
