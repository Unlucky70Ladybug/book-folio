import { type Genre } from '../../../types/genre'
import Cookies from 'js-cookie'

export const getGenres = async (): Promise<Genre[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/genres`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'ジャンルの取得に失敗しました')

  return json.genres
}
