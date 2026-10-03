import { useRef, useState, type RefObject } from 'react'
import { type Bookshelf, type PreferenceRating, type ReadingStatus } from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'
import { updateBookshelf } from '../_hooks/update-bookshelf'
import { useNotification } from '../../hooks/use-notification'
import { ReadingStatusField } from '../../components/bookshelf/fields/reading-status-field'
import { GenreField } from '../../components/bookshelf/fields/genre-field'
import { PreferenceRatingField } from '../../components/bookshelf/fields/preference-rating-field'

type ShowBookshelfModalProps = {
  bookshelf: Bookshelf
  genreList: Genre[]
  dialogRef: RefObject<HTMLDialogElement | null>
  onUpdated: (bookshelf: Bookshelf) => void
}

// 読書状況・好み評価・ジャンルを選んで本棚に登録するモーダル
export default function ShowBookshelfModal({
  bookshelf,
  genreList,
  dialogRef,
  onUpdated,
}: ShowBookshelfModalProps) {
  const { id, book, reading_status, preference_rating, genres } = bookshelf
  const { notify } = useNotification()
  // 読書状況・ジャンルは必須のため、未選択の間は登録できない
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(reading_status)
  const [preferenceRating, setPreferenceRating] = useState<PreferenceRating>(preference_rating)
  const [genreIds, setGenreIds] = useState<number[]>(genres.map((genre) => genre.id))
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 閉じるたびに増やし、key経由で入力欄の内部state(ジャンルメニューの開閉)もリセットする
  const [resetKey, setResetKey] = useState(0)
  // 更新成功で閉じたときは、送信した値をそのまま残す
  const isSavedRef = useRef(false)

  const close = () => dialogRef.current?.close()

  // 閉じたら次に開いたとき用に選択をリセットする
  const reset = () => {
    // closeイベントは親の再レンダーより先に届くことがあり、古いpropsで上書きしてしまうため
    if (!isSavedRef.current) {
      setReadingStatus(reading_status)
      setPreferenceRating(preference_rating)
      setGenreIds(genres.map((genre) => genre.id))
    }
    isSavedRef.current = false
    setResetKey((prev) => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      await updateBookshelf(id, readingStatus, preferenceRating, genreIds)
      // 送信した値で親の state を更新する
      onUpdated({
        ...bookshelf,
        reading_status: readingStatus,
        preference_rating: preferenceRating,
        genres: genreList.filter((genre) => genreIds.includes(genre.id)),
      })
      notify(`「${bookshelf.book.title}」を本棚に登録しました`, 'success')
      isSavedRef.current = true
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
              {book.large_image_url ? (
                <img
                  src={book.large_image_url}
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
