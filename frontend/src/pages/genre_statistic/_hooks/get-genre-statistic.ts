import { type GenreStatisticsResponse } from '../../../types/genre-statistic'
import Cookies from 'js-cookie'

export const getGenreStatisticsResult = async (): Promise<GenreStatisticsResponse> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/genre_statistics`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'ジャンル統計の取得に失敗しました')

  return json
}
