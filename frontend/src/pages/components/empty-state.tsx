type EmptyStateProps = {
  title: string
  description: string
}

// 統計・診断に表示するデータが無いときの案内。空のグラフ領域の代わりにカード内へ置く
export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="flex flex-1 flex-col items-center gap-4 py-10 text-center">
    <div className="flex size-16 items-center justify-center rounded-full bg-base-200 text-base-content/40">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="size-8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
    </div>
    <div className="flex flex-col gap-1">
      <p className="font-bold">{title}</p>
      <p className="text-sm text-base-content/60">{description}</p>
    </div>
  </div>
)
