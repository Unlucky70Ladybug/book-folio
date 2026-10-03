import { useState, type RefObject } from 'react'
import { type ApiBook } from '../../../types/book'
import { type Genre } from '../../../types/genre'
import { type PreferenceRating, type ReadingStatus } from '../../../types/bookshelf'
import { createBookshelf } from '../../bookshelf/_hooks/create-bookshelf'
import { useNotification } from '../../hooks/use-notification'
import { ReadingStatusField } from './fields/reading-status-field'
import { PreferenceRatingField } from './fields/preference-rating-field'
import { GenreField } from './fields/genre-field'

type AddToBookshelfModalProps = {
  book: ApiBook
  dialogRef: RefObject<HTMLDialogElement | null>
  genreList: Genre[]
}

// 読書状況・好み評価を選んで本棚に登録するモーダル
export default function AddToBookshelfModal({ book, dialogRef, genreList }: AddToBookshelfModalProps) {
  const { notify } = useNotification()
  // 読書状況は必須のため、未選択(null)の間は登録できない
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(null)
  const [preferenceRating, setPreferenceRating] = useState<PreferenceRating>('unrated')
  // ジャンルも必須のため、1つも選択されていない間は登録できない
  const [genreIds, setGenreIds] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const close = () => dialogRef.current?.close()

  // 閉じたら次に開いたとき用に選択をリセットする
  const reset = () => {
    setReadingStatus(null)
    setPreferenceRating('unrated')
    setGenreIds([])
    setResetKey((prev) => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!readingStatus || genreIds.length === 0) return

    setIsSubmitting(true)
    try {
      await createBookshelf(book, readingStatus, preferenceRating, genreIds)
      notify(`「${book.title}」を本棚に登録しました`, 'success')
    } catch (err) {
      notify(err instanceof Error ? err.message : '本棚への登録に失敗しました', 'error')
    } finally {
      setIsSubmitting(false)
      close()
    }
  }

  return (
    <dialog ref={dialogRef} className="modal" onClose={reset}>
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="text-lg font-bold">本棚に登録</h3>

        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex flex-col-reverse gap-5 sm:flex-row">
            {/* 左側：入力欄 */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
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

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={close}>
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!readingStatus || genreIds.length === 0 || isSubmitting}
            >
              {isSubmitting && <span className="loading loading-spinner loading-sm" />}
              登録する
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
