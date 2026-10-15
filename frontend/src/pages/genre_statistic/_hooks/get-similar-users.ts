import { type SimilarUser } from '../../../types/user'
import Cookies from 'js-cookie'

export const getSimilarUserResult = async (): Promise<SimilarUser> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user_comparisons`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'ユーザー統計情報の取得に失敗しました')

  return json.result
}
