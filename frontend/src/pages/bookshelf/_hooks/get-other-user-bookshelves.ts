import { type OtherUserBookshelves } from '../../../types/bookshelf'
import Cookies from 'js-cookie'

export const getOtherUserBookshelves = async (id: string): Promise<OtherUserBookshelves> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/bookshelves/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '本棚の情報取得に失敗しました')

  return json
}
