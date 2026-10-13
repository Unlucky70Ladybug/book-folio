import { type AuthorStatistics } from '../../../types/author-statistic'
import Cookies from 'js-cookie'

export const getAuthorStatisticsResult = async (): Promise<AuthorStatistics[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/author_statistics`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '著作者統計情報の取得に失敗しました')

  return json.result
}
