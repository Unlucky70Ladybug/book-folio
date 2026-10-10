import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUndiagnosed } from '../../_hooks/get-undiagnosed'
import { updatePreferenceRating } from '../../_hooks/update-preference-rating'
import { useNotification } from '../../../hooks/use-notification'
import { PREFERENCE_RATING_LABELS } from '../../../../types/bookshelf'
import { type BookUndiagnosedPreference } from '../../../../types/preference'
import {
  PREFERENCE_RATING_OPTIONS,
  type SelectableRating,
} from '../../../components/bookshelf/fields/options'
import Spinner from '../../../components/layouts/ui/spinner'

// 評価の高い順(お気に入り → 合わなかった)に並べる
const RATING_OPTIONS = [...PREFERENCE_RATING_OPTIONS].reverse()

const UndiagnosedUpdate = () => {
  const { notify } = useNotification()
  const [books, setBooks] = useState<BookUndiagnosedPreference[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // 表示中の本の位置。books.length になったら全て評価済み
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [submittingRating, setSubmittingRating] = useState<SelectableRating | null>(null)

  useEffect(() => {
    let ignore = false

    getUndiagnosed()
      .then((res) => {
        if (ignore) return
        setBooks(res)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : '書籍の取得に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [notify])

  const currentBook = books[currentIndex]
  const isFinished = currentIndex >= books.length

  const handleSelect = async (rating: SelectableRating) => {
    if (!currentBook || submittingRating) return

    setSubmittingRating(rating)
    try {
      await updatePreferenceRating(currentBook.id, rating)
      // 更新できたら次の本へ進む
      setCurrentIndex((index) => index + 1)
    } catch (err) {
      notify(err instanceof Error ? err.message : '好みの更新に失敗しました', 'error')
    } finally {
      setSubmittingRating(null)
    }
  }

  if (isLoading) return <Spinner message="未評価の本を読み込み中..." />

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div role="alert" className="alert w-full">
          <span>好みが未登録の本はありません。</span>
        </div>
        <Link to="/preference" className="btn">
          好み診断に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between">
          <p className="text-sm">
            評価済み
            <span className="mx-1 text-2xl font-bold tabular-nums">{currentIndex}</span>/{' '}
            {books.length}冊
          </p>
          <p className="text-sm text-base-content/60 tabular-nums">
            残り {books.length - currentIndex}冊
          </p>
        </div>
        <progress
          className="progress progress-primary h-3 w-full"
          value={currentIndex}
          max={books.length}
        />
      </div>

      {isFinished ? (
        <div className="flex flex-col items-center gap-4">
          <div role="alert" className="alert alert-success alert-soft w-full">
            <span>{books.length}冊の好みを登録しました。</span>
          </div>
          <Link to="/preference" className="btn btn-primary">
            診断結果を見る
          </Link>
        </div>
      ) : (
        <div className="card card-border bg-base-100">
          <div className="card-body flex-row gap-4">
            <img
              src={currentBook.book.large_image_url}
              alt={currentBook.book.title}
              className="h-40 w-auto max-w-28 shrink-0 self-start rounded-sm object-cover sm:h-56 sm:max-w-40"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h2 className="card-title text-base">{currentBook.book.title}</h2>
              <p className="text-sm text-base-content/60">{currentBook.book.author}</p>
              <div className="flex flex-wrap gap-1">
                {currentBook.genres.map((genre) => (
                  <span key={genre.id} className="badge badge-ghost badge-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              <div className="card-actions mt-2">
                {RATING_OPTIONS.map(({ value, color }) => (
                  <button
                    key={value}
                    type="button"
                    className={`btn btn-sm ${color}`}
                    disabled={submittingRating !== null}
                    onClick={() => handleSelect(value)}
                  >
                    {submittingRating === value && (
                      <span className="loading loading-spinner loading-xs" />
                    )}
                    {PREFERENCE_RATING_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UndiagnosedUpdate
