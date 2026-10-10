import { type PreferenceRating } from '../../../types/bookshelf'
import Cookies from 'js-cookie'

// 本棚の本の好み評価のみを更新する
export const updatePreferenceRating = async (
  id: number,
  preferenceRating: PreferenceRating,
): Promise<void> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/preferences/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
    body: JSON.stringify({ preference: { preference_rating: preferenceRating } }),
  })

  const json = await res.json()
  if (!res.ok)
    throw new Error(json?.errors?.join('\n') ?? json?.error ?? '好みの更新に失敗しました')
}
