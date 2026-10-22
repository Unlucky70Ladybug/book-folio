import { useState, type RefObject } from 'react'
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
  dialogRef: RefObject<HTMLDialogElement | null>
  genreList: Genre[]
  // 本棚に未登録のときはnull
  currentUserInfo: BookshelfPost | null
}

type FormValues = {
  readingStatus: ReadingStatus | null
  preferenceRating: PreferenceRating
  genreIds: number[]
  postDraft: CreatePostParams
}

const toFormValues = (info: BookshelfPost | null): FormValues => ({
  readingStatus: info?.reading_status ?? null,
  preferenceRating: info?.preference_rating ?? 'unrated',
  genreIds: info?.genres.map((genre) => genre.id) ?? [],
  postDraft: toPostDraft(info?.post ?? null),
})

// 本棚への登録(登録済みなら更新)モーダル
export default function PostBookshelfForm({
  book,
  dialogRef,
  genreList,
  currentUserInfo,
}: PostBookshelfFormProps) {
  const { notify } = useNotification()
  // 閉じたときに戻す値。保存に成功したらその内容に置き換える
  const [savedValues, setSavedValues] = useState<FormValues>(() => toFormValues(currentUserInfo))
  // 読書状況・ジャンルは必須のため、未選択の間は登録できない
  const [readingStatus, setReadingStatus] = useState(savedValues.readingStatus)
  const [preferenceRating, setPreferenceRating] = useState(savedValues.preferenceRating)
  const [genreIds, setGenreIds] = useState(savedValues.genreIds)
  const [postDraft, setPostDraft] = useState(savedValues.postDraft)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const isRegistered = currentUserInfo !== null
  const hasPost = postDraft.content.trim() !== ''
  const hasSpoilerSelected = postDraft.has_spoiler !== null
  // コメントとネタバレ有無は両方入力するか、両方空のときだけ登録できる
  const canSubmit = readingStatus !== null && genreIds.length > 0 && hasPost === hasSpoilerSelected

  const close = () => dialogRef.current?.close()

  // 閉じたら保存していない入力を取り消す
  const reset = () => {
    setReadingStatus(savedValues.readingStatus)
    setPreferenceRating(savedValues.preferenceRating)
    setGenreIds(savedValues.genreIds)
    setPostDraft(savedValues.postDraft)
    setResetKey((prev) => prev + 1)
  }

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
      setSavedValues({ readingStatus, preferenceRating, genreIds, postDraft })
      notify(`「${book.title}」を本棚に登録しました`, 'success')
      close()
    } catch (err) {
      notify(err instanceof Error ? err.message : '本棚への登録に失敗しました', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={reset}>
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="text-lg font-bold">
          {isRegistered ? '本棚の登録内容を編集' : '本棚に登録'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <p className="line-clamp-2 font-semibold">{book.title}</p>
              <p className="text-sm text-base-content/70">{book.author}</p>
            </div>

            <ReadingStatusField value={readingStatus} onChange={setReadingStatus} />
            <GenreField
              key={resetKey}
              genreList={genreList}
              value={genreIds}
              onChange={setGenreIds}
            />
            <PreferenceRatingField value={preferenceRating} onChange={setPreferenceRating} />
            <PostField value={postDraft} onChange={setPostDraft} />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={close}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit || isSubmitting}>
              {isSubmitting && <span className="loading loading-spinner loading-sm" />}
              {isRegistered ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>

      {/* 背景クリックで閉じる resetが呼ばれる */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
