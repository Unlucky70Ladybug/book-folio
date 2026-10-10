import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { getPreferenceResult } from '../../_hooks/get-preference'
import { useAuth } from '../../../hooks/use-auth'
import { useNotification } from '../../../hooks/use-notification'
import { type PreferenceRating } from '../../../../types/bookshelf'
import {
  RATING_COLORS,
  type Preference,
  type RatingSummary,
} from '../../../../types/preference'
import { PREFERENCE_RATING_LABELS, type BookshelfForPreference } from '../../../../types/bookshelf'
import { RatingChart } from '../../_components/rating-chart'
import {
  PreferenceBook,
  SHELF_BOARD_HEIGHT,
  SHELF_ROW_HEIGHT,
} from '../../_components/preference-book'
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

// 木目の背板と、一定間隔で並ぶ棚板を背景として描画する
const shelfStyle: CSSProperties = {
  backgroundImage: [
    // 棚板(上面のハイライト + 前面 + 下の影)
    `repeating-linear-gradient(to bottom,
      transparent 0 ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT}px,
      #e0a96d ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT}px ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT + 6}px,
      #b87a42 ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT + 6}px ${SHELF_ROW_HEIGHT - 4}px,
      #7a4b24 ${SHELF_ROW_HEIGHT - 4}px ${SHELF_ROW_HEIGHT}px)`,
    // 背板の木目
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 9px, rgba(255,255,255,0.03) 9px 11px, transparent 11px 23px)',
    // 背板の奥行き(上下を少し暗く)
    'linear-gradient(to bottom, rgba(60,30,10,0.25), transparent 15%, transparent 85%, rgba(60,30,10,0.2))',
  ].join(','),
  backgroundColor: '#a86d3a',
  minHeight: SHELF_ROW_HEIGHT,
}

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

          {preference && preference.total > 0 && (
            <>
              <div className="divider my-0" />
              <RatingChart
                summaries={summaries}
                unratedAction={
                  // 未評価の本が無いときは遷移させない
                  preference.counts.unrated > 0 && (
                    <Link to="/preference/update" className="btn btn-primary btn-xs">
                      {PREFERENCE_RATING_LABELS.unrated}のものを更新する
                    </Link>
                  )
                }
              />
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <Spinner message="診断結果を読み込み中..." />
      ) : !preference || preference.total === 0 ? (
        <div role="alert" className="alert">
          <span>まだ本が登録されていません。本を検索して本棚に追加してみましょう！</span>
        </div>
      ) : (
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
                        <PreferenceBook key={bookshelf.id} {...bookshelf} />
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
