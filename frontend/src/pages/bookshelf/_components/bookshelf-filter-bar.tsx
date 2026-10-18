import { SORT_TABS, type SortKey } from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'

type BookshelfFilterBarProps = {
  keyword: string
  onKeywordChange: (keyword: string) => void
  genres: Genre[]
  // nullのときは全ジャンルを表示する
  selectedGenreId: number | null
  onGenreChange: (genreId: number | null) => void
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
}

// 本棚の検索・絞り込み・並べ替えのUI。状態は親(本棚ページ)が持つ
export const BookshelfFilterBar = ({
  keyword,
  onKeywordChange,
  genres,
  selectedGenreId,
  onGenreChange,
  sortKey,
  onSortChange,
}: BookshelfFilterBarProps) => (
  <div className="flex flex-col gap-4">
    {/* キーワード検索(タイトル・著者) */}
    <label className="input input-sm w-full border-base-content/30 focus:outline-none focus-within:outline-none">
      <svg
        className="h-4 w-4 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="11" cy="11" r="8" strokeWidth="2" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <input
        type="search"
        placeholder="タイトル・著者で検索"
        aria-label="本棚の本を検索"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
      />
    </label>

    <div className="flex flex-wrap items-center justify-end gap-2">
      {/* ジャンルで絞り込み */}
      <select
        className="select select-sm w-auto"
        aria-label="ジャンルで絞り込み"
        value={selectedGenreId ?? ''}
        onChange={(event) =>
          onGenreChange(event.target.value === '' ? null : Number(event.target.value))
        }
      >
        <option value="">すべてのジャンル</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {/* 並べ替え */}
      <div role="tablist" className="tabs tabs-box tabs-sm">
        {SORT_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={sortKey === key}
            className={`tab ${sortKey === key ? 'tab-active' : ''}`}
            onClick={() => onSortChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  </div>
)
