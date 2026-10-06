import { type PreferenceRating, type ReadingStatus } from '../../../types/bookshelf'
import { type CreatePostParams } from '../../../types/post'
import Cookies from 'js-cookie'

// 本棚の本の読書状況・好み評価・ジャンルを更新する
export const updateBookshelf = async (
  id: number,
  readingStatus: ReadingStatus,
  preferenceRating: PreferenceRating,
  genreIds: number[],
  post: CreatePostParams | null,
): Promise<void> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/bookshelves/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
    body: JSON.stringify({
      bookshelf: {
        id: id,
        reading_status: readingStatus,
        preference_rating: preferenceRating,
        genre_ids: genreIds,
        ...(post && {
          post: { content: post.content, has_spoiler: post.has_spoiler },
        }),
      },
    }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || '本棚への登録に失敗しました')
}
