import { type Book } from '../../../types/book'
import Cookies from 'js-cookie'

export const searchBooks = async (type: string, keyword: string): Promise<Book[]> => {
  // URLのクエリ文字列を作成
  const params = new URLSearchParams({
    type: type,
    keyword: keyword,
  })

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/search?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '書籍検索に失敗しました')

  return json.books
}
