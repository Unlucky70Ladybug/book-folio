import { type Bookshelf } from '../../../types/bookshelf'
import Cookies from 'js-cookie'

export const getBookshelves = async (): Promise<Bookshelf[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/bookshelves`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '本棚の表示に失敗しました')

  return json.books
}
