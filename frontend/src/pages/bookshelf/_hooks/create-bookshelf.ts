import { type ApiBook } from '../../../types/book'
import { type PreferenceRating, type ReadingStatus } from '../../../types/bookshelf'
import { type CreatePostParams } from '../../../types/post'
import Cookies from 'js-cookie'

// 検索結果の本を読書状況・好み評価(・コメント)つきで自分の本棚に登録する
export const createBookshelf = async (
  book: ApiBook,
  readingStatus: ReadingStatus,
  preferenceRating: PreferenceRating,
  genreIds: number[],
  post: CreatePostParams | null,
): Promise<void> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/bookshelves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': Cookies.get('_access_token') ?? '',
      client: Cookies.get('_client') ?? '',
      uid: Cookies.get('_uid') ?? '',
    },
    body: JSON.stringify({
      bookshelf: {
        reading_status: readingStatus,
        preference_rating: preferenceRating,
        book: {
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          item_url: book.item_url,
          large_image_url: book.image_url,
        },
        genre_ids: genreIds,
        ...(post && { post }), // post が存在するときだけ追加
      },
    }),
  })

  const json = await res.json()
  if (!res.ok)
    throw new Error(json?.errors?.join('\n') ?? json?.error ?? '本棚への登録に失敗しました')
}
