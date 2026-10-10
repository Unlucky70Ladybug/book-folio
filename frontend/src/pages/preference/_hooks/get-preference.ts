import { type BookshelfPreference } from '../../../types/preference'
import Cookies from 'js-cookie'

export const getPreferenceResult = async (): Promise<BookshelfPreference> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/preferences`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '診断結果の取得に失敗しました')

  return json
}
