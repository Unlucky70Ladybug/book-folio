import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPreferenceResult } from '../../_hooks/get-preference'
import { useAuth } from '../../../hooks/use-auth'
import { useNotification } from '../../../hooks/use-notification'
import { type PreferenceRating } from '../../../../types/bookshelf'
import { RATING_COLORS, type Preference, type RatingSummary } from '../../../../types/preference'
import { PREFERENCE_RATING_LABELS, type BookshelfForPreference } from '../../../../types/bookshelf'
import { RatioChart, type RatioChartItem } from '../../../components/chart/ratio-chart'
import { ShelfBook } from '../../../components/shelf/shelf-book'
import { EmptyState } from '../../../components/empty-state'
import {
  SHELF_BOARD_HEIGHT,
  SHELF_ROW_HEIGHT,
  shelfStyle,
} from '../../../components/shelf/shelf-style'
import Spinner from '../../../components/layouts/ui/spinner'
import defaultUserImage from '../../../../assets/default_user_image.png'

// 評価の高い順に表示する
const RATED_RATINGS: PreferenceRating[] = [
  'favorite',
  'interesting',
  'normal',
  'not_for_me',
  'unrated',
]

const PreferenceResult = () => {
  const { currentUser } = useAuth()
  const { notify } = useNotification()
  const [books, setBooks] = useState<BookshelfForPreference[]>([])
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

  // 件数と割合はAPIの集計結果(preference)をそのまま使う。1冊もない評価はキーごと返ってこない
  const summaries: RatingSummary[] = RATED_RATINGS.map((rating) => ({
    rating,
    count: preference?.counts[rating] ?? 0,
    ratio: preference?.ratios[rating] ?? 0,
    books: books.filter(({ preference_rating }) => preference_rating === rating),
  }))

  const chartItems: RatioChartItem[] = summaries.map(
    ({ rating, count, ratio, books: ratedBooks }) => ({
      id: rating,
      label: PREFERENCE_RATING_LABELS[rating],
      count,
      ratio,
      color: RATING_COLORS[rating],
      titles: ratedBooks.map(({ book }) => book.title),
      // 未評価の本が無いときは遷移させない
      action: rating === 'unrated' && count > 0 && (
        <Link to="/preference/update" className="btn btn-primary btn-xs">
          {PREFERENCE_RATING_LABELS.unrated}のものを更新する
        </Link>
      ),
    }),
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ユーザー情報と評価の割合 */}
      <div className="card card-border bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={currentUser?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
                </div>
              </div>
              <h3 className="card-title text-base">{currentUser?.name}さんの好み診断</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:ml-auto">
              <span className="badge badge-primary badge-soft">
                登録数 {preference?.total ?? 0}冊
              </span>
              <span className="badge badge-ghost">
                {PREFERENCE_RATING_LABELS.unrated} {preference?.counts.unrated ?? 0}冊 (
                {preference?.ratios.unrated ?? 0}%)
              </span>
            </div>
          </div>

          {!isLoading && (
            <>
              <div className="divider my-0" />
              {preference && preference.total > 0 ? (
                <RatioChart items={chartItems} />
              ) : (
                <EmptyState
                  title="まだ本が登録されていません"
                  description="本を検索して本棚に追加すると、ここに評価の割合が表示されます"
                />
              )}
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <Spinner message="診断結果を読み込み中..." />
      ) : !preference || preference.total === 0 ? null : (
        <>
          {/* 評価ごとの本棚 */}
          {summaries.map(({ rating, count, ratio, books: ratedBooks }) => (
            <section key={rating} className="flex flex-col gap-3">
              <h2 className="flex items-center gap-3">
                <span
                  className="h-6 w-1.5 rounded-full"
                  style={{ backgroundColor: RATING_COLORS[rating] }}
                />
                <span className="text-lg font-bold">{PREFERENCE_RATING_LABELS[rating]}</span>
                <span className="badge badge-sm">{count}冊</span>
                <span className="ml-auto text-sm text-base-content/60 tabular-nums">{ratio}%</span>
              </h2>
              <div className="rounded-box border-[12px] border-[#7a4b24] shadow-xl">
                <div className="relative px-4 md:px-8" style={shelfStyle}>
                  {ratedBooks.length === 0 ? (
                    <div
                      className="flex items-center justify-center"
                      style={{ height: SHELF_ROW_HEIGHT, paddingBottom: SHELF_BOARD_HEIGHT }}
                    >
                      <p className="rounded-field bg-base-100/85 px-4 py-2 text-center text-sm shadow">
                        登録されている本はありません
                      </p>
                    </div>
                  ) : (
                    <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                      {ratedBooks.map((bookshelf) => (
                        <ShelfBook key={bookshelf.id} {...bookshelf.book} />
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}

export default PreferenceResult
