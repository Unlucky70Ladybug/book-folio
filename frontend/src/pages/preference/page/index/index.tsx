import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { getPreferenceResult } from '../../_hooks/get-preference'
import { useAuth } from '../../../hooks/use-auth'
import { useNotification } from '../../../hooks/use-notification'
import { type Preference } from '../../../../types/preference'
import {
  PREFERENCE_RATING_LABELS,
  type BookshelfForPreference,
  type PreferenceRating,
} from '../../../../types/bookshelf'
import Spinner from '../../../components/layouts/ui/spinner'
import defaultUserImage from '../../../../assets/default_user_image.png'

type RatedPreferenceRating = Exclude<PreferenceRating, 'unrated'>

// 評価の高い順に表示する
const RATED_RATINGS: RatedPreferenceRating[] = ['favorite', 'interesting', 'normal', 'not_for_me']

// 評価ごとのグラフの色(テーマのオレンジに合わせ、評価が高いほど濃い暖色にする)
const RATING_COLORS: Record<RatedPreferenceRating, string> = {
  favorite: 'oklch(58% 0.19 30)',
  interesting: 'oklch(74% 0.16 60)',
  normal: 'oklch(86% 0.09 85)',
  not_for_me: 'oklch(45% 0.03 55)',
}

// 円グラフを1周描き切るまでの時間(ms)
const CHART_DURATION = 1200
// 評価同士の境目に空ける隙間(%)
const SEGMENT_GAP = 0.6
// ホバー時に表示する本のタイトルの最大数
const MAX_TOOLTIP_TITLES = 8
const TOOLTIP_WIDTH = 224

// 1段の高さ(本 + 棚板)。本棚ページと同じ見た目に揃える
const SHELF_ROW_HEIGHT = 240
const SHELF_BOARD_HEIGHT = 40

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

type RatingSummary = {
  rating: RatedPreferenceRating
  count: number
  // 登録した本全体に対する割合(%)
  ratio: number
  books: BookshelfForPreference[]
}

type RatingChartProps = {
  summaries: RatingSummary[]
}

// 評価の割合を示す円グラフと内訳。表示時に12時の位置から時計回りに描画する
const RatingChart = ({ summaries }: RatingChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isDrawn, setIsDrawn] = useState<boolean>(false)
  const [activeRating, setActiveRating] = useState<RatedPreferenceRating | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const segments = summaries
    .filter(({ ratio }) => ratio > 0)
    .map((summary, i, list) => ({
      ...summary,
      start: list.slice(0, i).reduce((sum, { ratio }) => sum + ratio, 0),
    }))

  // ホバー中の評価。ホバーしていないときは最も割合の高い評価を中央に表示する
  const topSummary = summaries.reduce((top, summary) => (summary.ratio > top.ratio ? summary : top))
  const activeSummary = summaries.find(({ rating }) => rating === activeRating)
  const centerSummary = activeSummary ?? topSummary

  // カーソルの位置にタイトル一覧を追従させる(グラフの外にはみ出さないよう横位置を収める)
  const handleMouseMove = (e: MouseEvent<SVGCircleElement>, rating: RatedPreferenceRating) => {
    const rect = chartRef.current?.getBoundingClientRect()
    if (!rect) return
    const half = TOOLTIP_WIDTH / 2
    const x = Math.min(Math.max(e.clientX - rect.left, half), Math.max(rect.width - half, half))
    setActiveRating(rating)
    setTooltipPosition({ x, y: e.clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setActiveRating(null)
    setTooltipPosition(null)
  }

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-14">
      <div ref={chartRef} className="relative size-56 shrink-0 md:size-64">
        <svg
          viewBox="0 0 100 100"
          className="size-full -rotate-90"
          role="img"
          aria-label={summaries
            .map(({ rating, ratio }) => `${PREFERENCE_RATING_LABELS[rating]} ${ratio}%`)
            .join('、')}
        >
          {/* 評価が付いていない本の分は下地のまま残る */}
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" className="stroke-base-200" />
          {segments.map(({ rating, ratio, start }) => {
            const length = Math.max(ratio - SEGMENT_GAP, ratio / 2)
            const isDimmed = activeRating !== null && activeRating !== rating

            return (
              <circle
                key={rating}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                pathLength={100}
                stroke={RATING_COLORS[rating]}
                strokeWidth={activeRating === rating ? 15 : 12}
                strokeDasharray={`${isDrawn ? length : 0} 100`}
                strokeDashoffset={-start}
                opacity={isDimmed ? 0.3 : 1}
                className="cursor-pointer motion-reduce:transition-none"
                style={{
                  // 前の評価を描き終えてから次を描き始め、1本の線が回るように見せる
                  transition: [
                    `stroke-dasharray ${(ratio / 100) * CHART_DURATION}ms linear ${(start / 100) * CHART_DURATION}ms`,
                    'stroke-width 150ms ease-out',
                    'opacity 150ms ease-out',
                  ].join(','),
                }}
                onMouseMove={(e) => handleMouseMove(e, rating)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs tracking-widest text-base-content/60">
            {PREFERENCE_RATING_LABELS[centerSummary.rating]}
          </span>
          <span className="text-4xl font-bold tabular-nums">
            {centerSummary.ratio}
            <span className="text-lg">%</span>
          </span>
          <span className="text-xs text-base-content/60">{centerSummary.count}冊</span>
        </div>

        {/* ホバーした評価の本のタイトル */}
        {activeSummary && tooltipPosition && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-box bg-neutral p-3 text-xs text-neutral-content shadow-xl"
            style={{ left: tooltipPosition.x, top: tooltipPosition.y - 12, width: TOOLTIP_WIDTH }}
          >
            <p className="mb-1 flex items-center justify-between font-bold">
              <span>{PREFERENCE_RATING_LABELS[activeSummary.rating]}</span>
              <span>{activeSummary.count}冊</span>
            </p>
            <ul className="flex flex-col gap-0.5">
              {activeSummary.books.slice(0, MAX_TOOLTIP_TITLES).map(({ id, book }) => (
                <li key={id} className="truncate">
                  {book.title}
                </li>
              ))}
            </ul>
            {activeSummary.books.length > MAX_TOOLTIP_TITLES && (
              <p className="mt-1 text-neutral-content/60">
                ほか {activeSummary.books.length - MAX_TOOLTIP_TITLES}冊
              </p>
            )}
          </div>
        )}
      </div>

      {/* 内訳 */}
      <ul className="flex w-full max-w-sm flex-col gap-1">
        {summaries.map(({ rating, count, ratio }) => (
          <li
            key={rating}
            className={`rounded-field px-3 py-2 transition-colors ${activeRating === rating ? 'bg-base-200' : ''}`}
            onMouseEnter={() => setActiveRating(rating)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-baseline gap-3">
              <span className="flex-1 font-bold">{PREFERENCE_RATING_LABELS[rating]}</span>
              <span className="text-sm text-base-content/60">{count}冊</span>
              <span className="w-14 text-right text-lg font-bold tabular-nums">{ratio}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-base-200">
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                style={{ width: `${isDrawn ? ratio : 0}%`, backgroundColor: RATING_COLORS[rating] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 棚に並ぶ1冊分
const PreferenceBook = ({ book }: BookshelfForPreference) => (
  <li
    className="flex flex-col items-center justify-end"
    style={{ height: SHELF_ROW_HEIGHT, paddingBottom: SHELF_BOARD_HEIGHT }}
  >
    <div className="tooltip" data-tip={`${book.title} / ${book.author}`}>
      <img
        src={book.large_image_url}
        alt={book.title}
        loading="lazy"
        className="h-40 w-auto max-w-24 rounded-sm object-cover shadow-[3px_4px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-2 md:max-w-28"
      />
    </div>
  </li>
)

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
      {/* ユーザー情報 */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 rounded-full ring-4 ring-secondary/40 ring-offset-2 ring-offset-base-100">
                <img src={currentUser?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold">{currentUser?.name}の好み診断</p>
              <p className="text-sm text-base-content/60">{currentUser?.name}さん</p>
            </div>
          </div>

          <div className="stats stats-horizontal bg-base-200 md:ml-auto">
            <div className="stat place-items-center px-4 md:px-6">
              <div className="stat-title">登録数</div>
              <div className="stat-value text-primary">{preference?.total ?? 0}</div>
            </div>
            <div className="stat place-items-center px-4 md:px-6">
              <div className="stat-title">{PREFERENCE_RATING_LABELS.unrated}</div>
              <div className="stat-value text-2xl">{preference?.counts.unrated ?? 0}</div>
              <div className="stat-desc">{preference?.ratios.unrated ?? 0}%</div>
            </div>
          </div>
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
          {/* 評価の割合 */}
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <RatingChart summaries={summaries} />
            </div>
          </div>

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
                      className="flex items-end justify-center pb-14"
                      style={{ height: SHELF_ROW_HEIGHT }}
                    >
                      <p className="rounded-field bg-base-100/85 px-4 py-2 text-sm shadow">
                        「{PREFERENCE_RATING_LABELS[rating]}」の本はまだありません。
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
