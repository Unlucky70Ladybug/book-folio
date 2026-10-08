import { useEffect, useState } from 'react'
import { getPreferenceResult } from '../_hooks/get-preference'
import { useNotification } from '../../hooks/use-notification'
import { type Preference } from '../../../types/preference'
import {
  PREFERENCE_RATING_LABELS,
  type BookshelfForPreference,
  type PreferenceRating,
} from '../../../types/bookshelf'
import Spinner from '../../components/layouts/ui/spinner'

const PREFERENCE_RATINGS = Object.keys(PREFERENCE_RATING_LABELS) as PreferenceRating[]

const PreferenceResult = () => {
  const { notify } = useNotification()
  const [books, setBooks] = useState<BookshelfForPreference[] | null>(null)
  const [preference, setPreference] = useState<Preference | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false

    getPreferenceResult()
      .then((preferenceResult) => {
        if (ignore) return
        setBooks(preferenceResult.books)
        setPreference(preferenceResult.preference)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : '診断結果の表示に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [notify])

  if (isLoading) return <Spinner message="診断結果を読み込み中..." />
  if (!books || !preference) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="stats stats-vertical bg-base-200 md:stats-horizontal">
        <div className="stat place-items-center">
          <div className="stat-title">登録数</div>
          <div className="stat-value text-primary">{preference.total}</div>
        </div>
        {PREFERENCE_RATINGS.map((rating) => (
          <div key={rating} className="stat place-items-center">
            <div className="stat-title">{PREFERENCE_RATING_LABELS[rating]}</div>
            <div className="stat-value text-2xl">{preference.counts[rating] ?? 0}</div>
            <div className="stat-desc">{preference.ratios[rating] ?? 0}%</div>
          </div>
        ))}
      </div>

      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {books.map(({ id, preference_rating, book }) => (
          <li key={id} className="flex flex-col items-center gap-1">
            <img src={book.large_image_url} alt={book.title} className="h-36 object-contain" />
            <span className="badge badge-sm">{PREFERENCE_RATING_LABELS[preference_rating]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PreferenceResult
