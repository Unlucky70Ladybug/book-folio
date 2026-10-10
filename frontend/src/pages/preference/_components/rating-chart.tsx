import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { PREFERENCE_RATING_LABELS, type PreferenceRating } from '../../../types/bookshelf'
import { RATING_COLORS, type RatingSummary } from '../../../types/preference'

// 円グラフを1周描き切るまでの時間(ms)
const CHART_DURATION = 1200
// 評価同士の境目に空ける隙間(%)
const SEGMENT_GAP = 0.6
// ホバー時に表示する本のタイトルの最大数
const MAX_TOOLTIP_TITLES = 8
const TOOLTIP_WIDTH = 224

type RatingChartProps = {
  summaries: RatingSummary[]
  // 内訳の「未定義」の横に表示する操作
  unratedAction?: ReactNode
}

// 評価の割合を示す円グラフと内訳。表示時に12時の位置から時計回りに描画する
export const RatingChart = ({ summaries, unratedAction }: RatingChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isDrawn, setIsDrawn] = useState<boolean>(false)
  const [activeRating, setActiveRating] = useState<PreferenceRating | null>(null)
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
  const handleMouseMove = (e: MouseEvent<SVGCircleElement>, rating: PreferenceRating) => {
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
              <span className="flex flex-1 flex-wrap items-center gap-2 font-bold">
                {PREFERENCE_RATING_LABELS[rating]}
                {rating === 'unrated' && count > 0 && unratedAction}
              </span>
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
