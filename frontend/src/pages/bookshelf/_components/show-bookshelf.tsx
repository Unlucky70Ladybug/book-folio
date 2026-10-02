import { useId, useState, type RefObject } from 'react'
import { type Bookshelf } from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'
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
  // ジャンル追加メニュー(Speed Dial)の開閉
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 同じページに複数のモーダルが並ぶため、ラジオのnameを一意にする
  const radio_id = useId()

  const close = () => dialogRef.current?.close()

  // 閉じたら次に開いたとき用に選択をリセットする
  const reset = () => {
    setReadingStatus(reading_status)
    setPreferenceRating(preference_rating)
    setGenreIds(genres.map((genre) => genre.id))
    setIsGenreMenuOpen(false)
  }

  // 選択中の評価をもう一度押すと未評価に戻す
  const toggleRating = (rating: SelectableRating) => {
    setPreferenceRating((prev) => (prev === rating ? 'unrated' : rating))
  }

  const addGenre = (genreId: number) => setGenreIds((prev) => [...prev, genreId])
  const removeGenre = (genreId: number) =>
    setGenreIds((prev) => prev.filter((id) => id !== genreId))

  // 一覧の並び順で表示するため、genreList から絞り込む
  const selectedGenres = genreList.filter((genre) => genreIds.includes(genre.id))
  // メニューには未選択のジャンルだけを出す
  const addableGenres = genreList.filter((genre) => !genreIds.includes(genre.id))

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
        genres: selectedGenres,
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
                  ジャンル
                  <span className="badge badge-xs badge-primary badge-soft rounded-sm">必須</span>
                </legend>

                {/* 選択中のジャンル(×で解除) + 追加ボタン */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedGenres.map((genre) => (
                    <span key={genre.id} className="badge badge-secondary gap-1">
                      {genre.name}
                      <button
                        type="button"
                        aria-label={`${genre.name}を解除`}
                        className="cursor-pointer opacity-70 hover:opacity-100"
                        onClick={() => removeGenre(genre.id)}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <div className="tooltip" data-tip={isGenreMenuOpen ? '閉じる' : 'ジャンルを追加'}>
                    <button
                      type="button"
                      aria-label="ジャンルを追加"
                      aria-expanded={isGenreMenuOpen}
                      className="btn btn-circle btn-sm btn-secondary"
                      onClick={() => setIsGenreMenuOpen((prev) => !prev)}
                    >
                      {/* 開いている間は＋を45度回して×に見せる */}
                      <span
                        className={`text-lg leading-none transition-transform duration-200 ${isGenreMenuOpen ? 'rotate-45' : ''}`}
                      >
                        +
                      </span>
                    </button>
                  </div>
                </div>

                {/* 追加できるジャンル一覧(FABのように開閉する) */}
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ${isGenreMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="mt-2 flex flex-wrap gap-2 rounded-box bg-base-200 p-3">
                      {addableGenres.length === 0 ? (
                        <span className="text-xs text-base-content/60">
                          すべてのジャンルを追加済みです
                        </span>
                      ) : (
                        addableGenres.map((genre, i) => (
                          <button
                            key={genre.id}
                            type="button"
                            tabIndex={isGenreMenuOpen ? 0 : -1}
                            className={`btn btn-xs btn-secondary btn-outline rounded-full bg-base-100 transition-[scale,opacity] duration-200 ${isGenreMenuOpen ? 'scale-100 opacity-100' : 'scale-80 opacity-0'}`}
                            // 順番に飛び出して見えるよう少しずつ遅らせる
                            style={{
                              transitionDelay: isGenreMenuOpen
                                ? `${Math.min(i, 10) * 20}ms`
                                : '0ms',
                            }}
                            onClick={() => addGenre(genre.id)}
                          >
                            + {genre.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {genreIds.length === 0 ? (
                  <p className="label text-xs text-error">
                    ＋ボタンからジャンルを1つ以上追加してください
                  </p>
                ) : (
                  <p className="label text-xs">✕で解除、＋から追加できます</p>
                )}
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
