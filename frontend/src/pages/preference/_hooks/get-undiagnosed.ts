import { type BookUndiagnosedPreference } from '../../../types/preference'
import Cookies from 'js-cookie'

export const getUndiagnosed = async (): Promise<BookUndiagnosedPreference[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/preferences/undiagnosed`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '書籍の取得に失敗しました')

  return json.books
}
