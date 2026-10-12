import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { type GenreSummary } from '../../../types/genre-statistic'

// 円グラフを1周描き切るまでの時間(ms)
const CHART_DURATION = 1200
// ジャンル同士の境目に空ける隙間(%)
const SEGMENT_GAP = 0.6
// ホバー時に表示する本のタイトルの最大数
const MAX_TOOLTIP_TITLES = 8
const TOOLTIP_WIDTH = 224

type GenreChartProps = {
  summaries: GenreSummary[]
}

// ジャンルの割合を示す円グラフと内訳。表示時に12時の位置から時計回りに描画する
export const GenreChart = ({ summaries }: GenreChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isDrawn, setIsDrawn] = useState<boolean>(false)
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null)
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

  // ホバー中のジャンル。ホバーしていないときは最も割合の高いジャンルを中央に表示する
  const topSummary = summaries.reduce((top, summary) => (summary.ratio > top.ratio ? summary : top))
  const activeSummary = summaries.find(({ id }) => id === activeGenreId)
  const centerSummary = activeSummary ?? topSummary

  // カーソルの位置にタイトル一覧を追従させる(グラフの外にはみ出さないよう横位置を収める)
  const handleMouseMove = (e: MouseEvent<SVGCircleElement>, genreId: number) => {
    const rect = chartRef.current?.getBoundingClientRect()
    if (!rect) return
    const half = TOOLTIP_WIDTH / 2
    const x = Math.min(Math.max(e.clientX - rect.left, half), Math.max(rect.width - half, half))
    setActiveGenreId(genreId)
    setTooltipPosition({ x, y: e.clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setActiveGenreId(null)
    setTooltipPosition(null)
  }

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-14">
      <div ref={chartRef} className="relative size-56 shrink-0 md:size-64">
        <svg
          viewBox="0 0 100 100"
          className="size-full -rotate-90"
          role="img"
          aria-label={summaries.map(({ name, ratio }) => `${name} ${ratio}%`).join('、')}
        >
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" className="stroke-base-200" />
          {segments.map(({ id, ratio, start, color }) => {
            const length = Math.max(ratio - SEGMENT_GAP, ratio / 2)
            const isDimmed = activeGenreId !== null && activeGenreId !== id

            return (
              <circle
                key={id}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                pathLength={100}
                stroke={color}
                strokeWidth={activeGenreId === id ? 15 : 12}
                strokeDasharray={`${isDrawn ? length : 0} 100`}
                strokeDashoffset={-start}
                opacity={isDimmed ? 0.3 : 1}
                className="cursor-pointer motion-reduce:transition-none"
                style={{
                  // 前のジャンルを描き終えてから次を描き始め、1本の線が回るように見せる
                  transition: [
                    `stroke-dasharray ${(ratio / 100) * CHART_DURATION}ms linear ${(start / 100) * CHART_DURATION}ms`,
                    'stroke-width 150ms ease-out',
                    'opacity 150ms ease-out',
                  ].join(','),
                }}
                onMouseMove={(e) => handleMouseMove(e, id)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="max-w-32 truncate text-xs tracking-widest text-base-content/60">
            {centerSummary.name}
          </span>
          <span className="text-4xl font-bold tabular-nums">
            {centerSummary.ratio}
            <span className="text-lg">%</span>
          </span>
          <span className="text-xs text-base-content/60">{centerSummary.books_count}冊</span>
        </div>

        {/* ホバーしたジャンルの本のタイトル */}
        {activeSummary && tooltipPosition && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-box bg-neutral p-3 text-xs text-neutral-content shadow-xl"
            style={{ left: tooltipPosition.x, top: tooltipPosition.y - 12, width: TOOLTIP_WIDTH }}
          >
            <p className="mb-1 flex items-center justify-between gap-2 font-bold">
              <span className="truncate">{activeSummary.name}</span>
              <span className="shrink-0">{activeSummary.books_count}冊</span>
            </p>
            <ul className="flex flex-col gap-0.5">
              {activeSummary.books.slice(0, MAX_TOOLTIP_TITLES).map(({ id, title }) => (
                <li key={id} className="truncate">
                  {title}
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
        {summaries.map(({ id, name, books_count, ratio, color }) => (
          <li
            key={id}
            className={`rounded-field px-3 py-2 transition-colors ${activeGenreId === id ? 'bg-base-200' : ''}`}
            onMouseEnter={() => setActiveGenreId(id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-baseline gap-3">
              <span className="flex-1 font-bold">{name}</span>
              <span className="text-sm text-base-content/60">{books_count}冊</span>
              <span className="w-14 text-right text-lg font-bold tabular-nums">{ratio}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-base-200">
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                style={{ width: `${isDrawn ? ratio : 0}%`, backgroundColor: color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
