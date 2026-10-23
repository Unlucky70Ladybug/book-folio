import { type PostsResponse } from '../../../types/post'
import Cookies from 'js-cookie'

export const getPostsResult = async (isbn: string): Promise<PostsResponse> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/books/${isbn}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'コメントの取得に失敗しました')

  return json
}
