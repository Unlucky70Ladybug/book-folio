import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getUndiagnosed } from '../../_hooks/get-undiagnosed'
import { updatePreferenceRating } from '../../_hooks/update-preference-rating'
import { useNotification } from '../../../hooks/use-notification'
import { type BookUndiagnosedPreference } from '../../../../types/preference'
import { type SelectableRating } from '../../../components/bookshelf/fields/options'
import { RatingCard } from '../../_components/rating-card'
import Spinner from '../../../components/layouts/ui/spinner'

// 全て評価し終えてから診断結果へ移動するまでの時間(ms)
const REDIRECT_DELAY = 3000

const UndiagnosedUpdate = () => {
  const { notify } = useNotification()
  const navigate = useNavigate()
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
  // 直前に評価した本。左へスライドして出ていくカードとして表示する
  const previousBook = books[currentIndex - 1]
  const isFinished = books.length > 0 && currentIndex >= books.length

  // 全て評価し終えたら、少し待ってから診断結果へ移動する
  useEffect(() => {
    if (!isFinished) return

    const timer = setTimeout(() => navigate('/preference', { replace: true }), REDIRECT_DELAY)
    return () => clearTimeout(timer)
  }, [isFinished, navigate])

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

  if (books.length === 0) return <Navigate to="/preference" replace />

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between">
          <p className="text-sm">
            評価済み
            <span className="mx-1 text-2xl font-bold tabular-nums">{currentIndex}</span>/{' '}
            {books.length}冊
          </p>
          <span className="badge badge-primary badge-soft tabular-nums">
            残り {books.length - currentIndex}冊
          </span>
        </div>
        <progress
          className="progress progress-primary h-3 w-full"
          value={currentIndex}
          max={books.length}
        />
      </div>

      {/* はみ出したカードを隠して、右から左へスライドして入れ替わるように見せる */}
      <div className="relative overflow-hidden">
        {previousBook && (
          <div
            key={`out-${previousBook.id}`}
            aria-hidden
            className="slide-out-to-left pointer-events-none absolute inset-x-0 top-0"
          >
            <RatingCard book={previousBook} submittingRating={null} />
          </div>
        )}

        {isFinished ? (
          <div key="finished" className="slide-in-from-right flex flex-col items-center gap-4">
            <div role="alert" className="alert alert-success alert-soft w-full">
              <span>{books.length}冊の好みを登録しました。</span>
            </div>
            <p className="flex items-center gap-2 text-sm text-base-content/60">
              <span className="loading loading-dots loading-sm" />
              {REDIRECT_DELAY / 1000}秒後に診断結果へ移動します
            </p>
            <Link to="/preference" replace className="btn btn-primary">
              診断結果を見る
            </Link>
          </div>
        ) : (
          <div
            key={currentBook.id}
            className={currentIndex > 0 ? 'slide-in-from-right' : undefined}
          >
            <RatingCard
              book={currentBook}
              submittingRating={submittingRating}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default UndiagnosedUpdate
