import { useId, useState, type RefObject } from 'react'
import { type Bookshelf } from '../../../types/bookshelf'
import {
  PREFERENCE_RATING_LABELS,
  READING_STATUS_LABELS,
  type PreferenceRating,
  type ReadingStatus,
} from '../../../types/bookshelf'
import { updateBookshelf } from '../_hooks/update-bookshelf'
import { useNotification } from '../../hooks/use-notification'

// 選択肢ごとの色(Tailwindが検出できるようクラス名はリテラルで持つ)
const READING_STATUS_COLORS: Record<ReadingStatus, string> = {
  interested: 'btn-info',
  reading: 'btn-primary',
  finished: 'btn-success',
}

// unrated は「未選択」扱いのため選択肢には出さない
type SelectableRating = Exclude<PreferenceRating, 'unrated'>

// テーマに灰色・ピンクが無いため、daisyUIのボタン色変数を直接上書きする
const PREFERENCE_RATING_OPTIONS: { value: SelectableRating; color: string }[] = [
  { value: 'not_for_me', color: '[--btn-color:var(--color-gray-400)] [--btn-fg:white]' },
  { value: 'normal', color: 'btn-success' },
  { value: 'interesting', color: 'btn-warning' },
  { value: 'favorite', color: '[--btn-color:var(--color-pink-400)] [--btn-fg:white]' },
]

// ReadingStatus型の配列を作成 値：['interested', 'reading', 'finished']
const READING_STATUSES = Object.keys(READING_STATUS_LABELS) as ReadingStatus[]

// 未選択は淡い色、選択中は塗りつぶし
const optionClass = (color: string, selected: boolean) =>
  `btn btn-sm ${color} ${selected ? '' : 'btn-soft'}`

type ShowBookshelfModalProps = {
  bookshelf: Bookshelf
  dialogRef: RefObject<HTMLDialogElement | null>
  onUpdated: (bookshelf: Bookshelf) => void
}

// 読書状況・好み評価を選んで本棚に登録するモーダル
export default function ShowBookshelfModal({
  bookshelf,
  dialogRef,
  onUpdated,
}: ShowBookshelfModalProps) {
  const { id, book, reading_status, preference_rating } = bookshelf
  const { notify } = useNotification()
  // 読書状況は必須のため、未選択(null)の間は登録できない
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(reading_status)
  const [preferenceRating, setPreferenceRating] = useState<PreferenceRating>(preference_rating)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 同じページに複数のモーダルが並ぶため、ラジオのnameを一意にする
  const radio_id = useId()

  const close = () => dialogRef.current?.close()

  // 閉じたら次に開いたとき用に選択をリセットする
  const reset = () => {
    setReadingStatus(reading_status)
    setPreferenceRating(preference_rating)
  }

  // 選択中の評価をもう一度押すと未評価に戻す
  const toggleRating = (rating: SelectableRating) => {
    setPreferenceRating((prev) => (prev === rating ? 'unrated' : rating))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      await updateBookshelf(id, readingStatus, preferenceRating)
      // 送信した値で親の state を更新する
      onUpdated({
        ...bookshelf,
        reading_status: readingStatus,
        preference_rating: preferenceRating,
      })
      notify(`「${bookshelf.book.title}」を本棚に登録しました`, 'success')
      close()
    } catch (err) {
      notify(err instanceof Error ? err.message : '本棚への登録に失敗しました', 'error')
    } finally {
      setIsSubmitting(false)
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

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  読書状況
                  <span className="badge badge-xs badge-primary badge-soft rounded-sm">必須</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {READING_STATUSES.map((status) => (
                    <input
                      key={status}
                      type="radio"
                      name={`${radio_id}-reading-status`}
                      aria-label={READING_STATUS_LABELS[status]}
                      className={optionClass(
                        READING_STATUS_COLORS[status],
                        readingStatus === status,
                      )}
                      checked={readingStatus === status}
                      onChange={() => setReadingStatus(status)}
                      required
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  好み評価
                  <span className="badge badge-xs badge-ghost rounded-sm">任意</span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PREFERENCE_RATING_OPTIONS.map(({ value, color }) => (
                    <input
                      key={value}
                      type="radio"
                      name={`${radio_id}-preference-rating`}
                      aria-label={`${PREFERENCE_RATING_LABELS[value]}`}
                      className={optionClass(color, preferenceRating === value)}
                      checked={preferenceRating === value}
                      readOnly
                      onClick={() => toggleRating(value)}
                    />
                  ))}
                </div>
                <p className="label text-xs">もう一度押すと選択を解除できます</p>
              </fieldset>
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
              disabled={!readingStatus || isSubmitting}
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
