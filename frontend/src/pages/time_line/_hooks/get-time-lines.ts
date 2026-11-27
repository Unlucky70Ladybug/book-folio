import { type TimeLinesBookshelf } from '../../../types/bookshelf'
import Cookies from 'js-cookie'

export type TimeLineResponse = {
  result: TimeLinesBookshelf[]
  total_count: number
}

export const getTimeLine = async (page = 1): Promise<TimeLineResponse> => {
  const params = new URLSearchParams({ page: String(page) })
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/time_lines?${params}`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'タイムラインの取得に失敗しました')

  return json
}
