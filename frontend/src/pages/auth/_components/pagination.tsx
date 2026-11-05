type PaginationProps = {
  currentPage: number
  nextPage: () => void
  prevPage: () => void
  lastPage?: boolean
}

const ChevronIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
    aria-hidden="true"
  >
    <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
)

const Pagination = ({ currentPage, nextPage, prevPage, lastPage = false }: PaginationProps) => {
  const isFirstPage = currentPage <= 1

  return (
    <nav aria-label="ページ送り" className="flex items-center justify-center gap-3">
      <button
        type="button"
        className="btn btn-circle btn-primary"
        aria-label="前のページへ"
        onClick={prevPage}
        disabled={isFirstPage}
      >
        <ChevronIcon direction="left" />
      </button>

      <span
        className="flex h-10 min-w-24 items-center justify-center rounded-field border border-base-300 bg-base-100 px-4 text-sm font-medium"
        aria-current="page"
      >
        {currentPage} ページ
      </span>

      <button
        type="button"
        className="btn btn-circle btn-primary"
        aria-label="次のページへ"
        onClick={nextPage}
        disabled={lastPage}
      >
        <ChevronIcon direction="right" />
      </button>
    </nav>
  )
}

export default Pagination
