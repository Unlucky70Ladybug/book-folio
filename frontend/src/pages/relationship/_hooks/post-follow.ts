import { type RelationshipStats } from '../../../types/relationship'
import Cookies from 'js-cookie'

export const postFollow = async (id: number): Promise<RelationshipStats> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/relationships`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
    body: JSON.stringify({ followed_id: id }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '失敗しました')

  return json.result
}
