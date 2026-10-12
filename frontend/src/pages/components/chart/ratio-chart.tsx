import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'

// 円グラフを1周描き切るまでの時間(ms)
const CHART_DURATION = 1200
// 項目同士の境目に空ける隙間(%)
const SEGMENT_GAP = 0.6
// ホバー時に表示する本のタイトルの最大数
const MAX_TOOLTIP_TITLES = 8
const TOOLTIP_WIDTH = 224

// 円グラフの1項目(評価やジャンルなど)
export type RatioChartItem = {
  id: string | number
  label: string
  count: number
  // 全体に対する割合(%)
  ratio: number
  color: string
  // ホバー時に表示する本のタイトル
  titles: string[]
  // 内訳のラベルの横に表示する操作
  action?: ReactNode
}

type RatioChartProps = {
  items: RatioChartItem[]
}

// 割合を示す円グラフと内訳。表示時に12時の位置から時計回りに描画する
export const RatioChart = ({ items }: RatioChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isDrawn, setIsDrawn] = useState<boolean>(false)
  const [activeId, setActiveId] = useState<RatioChartItem['id'] | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsDrawn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const segments = items
    .filter(({ ratio }) => ratio > 0)
    .map((item, i, list) => ({
      ...item,
      start: list.slice(0, i).reduce((sum, { ratio }) => sum + ratio, 0),
    }))

  // ホバー中の項目。ホバーしていないときは最も割合の高い項目を中央に表示する
  const topItem = items.reduce((top, item) => (item.ratio > top.ratio ? item : top))
  const activeItem = items.find(({ id }) => id === activeId)
  const centerItem = activeItem ?? topItem

  // カーソルの位置にタイトル一覧を追従させる(グラフの外にはみ出さないよう横位置を収める)
  const handleMouseMove = (e: MouseEvent<SVGCircleElement>, id: RatioChartItem['id']) => {
    const rect = chartRef.current?.getBoundingClientRect()
    if (!rect) return
    const half = TOOLTIP_WIDTH / 2
    const x = Math.min(Math.max(e.clientX - rect.left, half), Math.max(rect.width - half, half))
    setActiveId(id)
    setTooltipPosition({ x, y: e.clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setActiveId(null)
    setTooltipPosition(null)
  }

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-14">
      <div ref={chartRef} className="relative size-56 shrink-0 md:size-64">
        <svg
          viewBox="0 0 100 100"
          className="size-full -rotate-90"
          role="img"
          aria-label={items.map(({ label, ratio }) => `${label} ${ratio}%`).join('、')}
        >
          {/* 割合が100%に満たない分は下地のまま残る */}
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" className="stroke-base-200" />
          {segments.map(({ id, ratio, start, color }) => {
            const length = Math.max(ratio - SEGMENT_GAP, ratio / 2)
            const isDimmed = activeId !== null && activeId !== id

            return (
              <circle
                key={id}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                pathLength={100}
                stroke={color}
                strokeWidth={activeId === id ? 15 : 12}
                strokeDasharray={`${isDrawn ? length : 0} 100`}
                strokeDashoffset={-start}
                opacity={isDimmed ? 0.3 : 1}
                className="cursor-pointer motion-reduce:transition-none"
                style={{
                  // 前の項目を描き終えてから次を描き始め、1本の線が回るように見せる
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
            {centerItem.label}
          </span>
          <span className="text-4xl font-bold tabular-nums">
            {centerItem.ratio}
            <span className="text-lg">%</span>
          </span>
          <span className="text-xs text-base-content/60">{centerItem.count}冊</span>
        </div>

        {/* ホバーした項目の本のタイトル */}
        {activeItem && tooltipPosition && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-box bg-neutral p-3 text-xs text-neutral-content shadow-xl"
            style={{ left: tooltipPosition.x, top: tooltipPosition.y - 12, width: TOOLTIP_WIDTH }}
          >
            <p className="mb-1 flex items-center justify-between gap-2 font-bold">
              <span className="truncate">{activeItem.label}</span>
              <span className="shrink-0">{activeItem.count}冊</span>
            </p>
            <ul className="flex flex-col gap-0.5">
              {activeItem.titles.slice(0, MAX_TOOLTIP_TITLES).map((title, i) => (
                <li key={i} className="truncate">
                  {title}
                </li>
              ))}
            </ul>
            {activeItem.titles.length > MAX_TOOLTIP_TITLES && (
              <p className="mt-1 text-neutral-content/60">
                ほか {activeItem.titles.length - MAX_TOOLTIP_TITLES}冊
              </p>
            )}
          </div>
        )}
      </div>

      {/* 内訳。項目が多いときは一覧の中でスクロールする */}
      <ul className="flex max-h-80 w-full max-w-sm flex-col gap-1 overflow-y-auto overscroll-contain pr-1">
        {items.map(({ id, label, count, ratio, color, action }) => (
          <li
            key={id}
            className={`rounded-field px-3 py-2 transition-colors ${activeId === id ? 'bg-base-200' : ''}`}
            onMouseEnter={() => setActiveId(id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-baseline gap-3">
              <span className="flex flex-1 flex-wrap items-center gap-2 font-bold">
                {label}
                {action}
              </span>
              <span className="text-sm text-base-content/60">{count}冊</span>
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
