import { type RelationshipStats } from '../../../types/relationship'
import Cookies from 'js-cookie'

export const deleteFollow = async (id: number): Promise<RelationshipStats> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/relationships/${id}`, {
    method: 'DELETE',
    headers: {
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '失敗しました')

  return json.result
}
