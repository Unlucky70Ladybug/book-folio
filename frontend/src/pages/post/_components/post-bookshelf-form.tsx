import { useState } from 'react'
import { type ApiBook } from '../../../types/book'
import {
  type BookshelfPost,
  type PreferenceRating,
  type ReadingStatus,
} from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'
import { toPostDraft, type CreatePostParams } from '../../../types/post'
import { createBookshelf } from '../../bookshelf/_hooks/create-bookshelf'
import { updateBookshelf } from '../../bookshelf/_hooks/update-bookshelf'
import { useNotification } from '../../hooks/use-notification'
import { ReadingStatusField } from '../../components/bookshelf/fields/reading-status-field'
import { GenreField } from '../../components/bookshelf/fields/genre-field'
import { PreferenceRatingField } from '../../components/bookshelf/fields/preference-rating-field'
import { PostField } from '../../components/bookshelf/fields/post-field'

type PostBookshelfFormProps = {
  book: ApiBook
  genreList: Genre[]
  // 本棚に未登録のときはnull
  currentUserInfo: BookshelfPost | null
}

// 本棚への登録(登録済みなら更新)フォーム。ページ冒頭に直接表示する
export default function PostBookshelfForm({
  book,
  genreList,
  currentUserInfo,
}: PostBookshelfFormProps) {
  const { notify } = useNotification()
  // 読書状況・ジャンルは必須のため、未選択の間は登録できない
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(
    currentUserInfo?.reading_status ?? null,
  )
  const [preferenceRating, setPreferenceRating] = useState<PreferenceRating>(
    currentUserInfo?.preference_rating ?? 'unrated',
  )
  const [genreIds, setGenreIds] = useState<number[]>(
    currentUserInfo?.genres.map((genre) => genre.id) ?? [],
  )
  const [postDraft, setPostDraft] = useState<CreatePostParams>(
    toPostDraft(currentUserInfo?.post ?? null),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isRegistered = currentUserInfo !== null
  const hasPost = postDraft.content.trim() !== ''
  const hasSpoilerSelected = postDraft.has_spoiler !== null
  // コメントとネタバレ有無は両方入力するか、両方空のときだけ登録できる
  const canSubmit = readingStatus !== null && genreIds.length > 0 && hasPost === hasSpoilerSelected

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit || readingStatus === null) return

    setIsSubmitting(true)
    try {
      const post = hasPost ? postDraft : null
      if (isRegistered) {
        await updateBookshelf(currentUserInfo.id, readingStatus, preferenceRating, genreIds, post)
      } else {
        await createBookshelf(book, readingStatus, preferenceRating, genreIds, post)
      }
      notify(`「${book.title}」を本棚に登録しました`, 'success')
    } catch (err) {
      notify(err instanceof Error ? err.message : '本棚への登録に失敗しました', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card card-border bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-2">
          <h3 className="card-title text-lg">本棚に登録</h3>
          {isRegistered && <span className="badge badge-primary badge-soft">登録済み</span>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-2 flex flex-col-reverse gap-5 sm:flex-row">
            {/* 左側：入力欄 */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div>
                <p className="line-clamp-2 font-semibold">{book.title}</p>
                <p className="text-sm text-base-content/70">{book.author}</p>
              </div>

              <ReadingStatusField value={readingStatus} onChange={setReadingStatus} />
              <GenreField genreList={genreList} value={genreIds} onChange={setGenreIds} />
              <PreferenceRatingField value={preferenceRating} onChange={setPreferenceRating} />
              <PostField value={postDraft} onChange={setPostDraft} />
            </div>

            {/* 右側：書影 */}
            <figure className="flex h-[200px] w-[150px] shrink-0 items-center justify-center self-center rounded-box bg-base-200 sm:self-start">
              {book.image_url ? (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="text-xs text-base-content/50">No Image</span>
              )}
            </figure>
          </div>

          <div className="card-actions mt-4 justify-end">
            <button type="submit" className="btn btn-primary" disabled={!canSubmit || isSubmitting}>
              {isSubmitting && <span className="loading loading-spinner loading-sm" />}
              {isRegistered ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
