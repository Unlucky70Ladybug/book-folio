import {
  PREFERENCE_SORT_TABS,
  READING_SORT_TABS,
  type PreferenceSortKey,
  type ReadingSortKey,
} from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'

type BookshelfFilterBarProps = {
  keyword: string
  onKeywordChange: (keyword: string) => void
  genres: Genre[]
  // nullのときは全ジャンルを表示する
  selectedGenreId: number | null
  onGenreChange: (genreId: number | null) => void
  preferenceSortKey: PreferenceSortKey
  onPreferenceSortChange: (key: PreferenceSortKey) => void
  readingSortKey: ReadingSortKey
  onReadingSortChange: (key: ReadingSortKey) => void
}

// 本棚の検索・絞り込み・並べ替えのUI。状態は親(本棚ページ)が持つ
export const BookshelfFilterBar = ({
  keyword,
  onKeywordChange,
  genres,
  selectedGenreId,
  onGenreChange,
  preferenceSortKey,
  onPreferenceSortChange,
  readingSortKey,
  onReadingSortChange,
}: BookshelfFilterBarProps) => (
  <div className="flex flex-col gap-3 border-x border-base-300 bg-base-200 px-4 py-3 md:flex-row md:items-center">
    {/* 本の検索とジャンルの絞り込みを1つのグループにまとめる */}
    <div className="join w-full md:max-w-xl">
      {/* キーワード検索(タイトル・著者) */}
      <label className="input input-sm join-item w-full">
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

      {/* ジャンルで絞り込み */}
      <select
        className="select select-sm join-item w-40 shrink-0"
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
    </div>

    {/* 並べ替え */}
    <div role="tablist" className="tabs tabs-box tabs-sm self-end bg-base-100 md:self-auto">
      {PREFERENCE_SORT_TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={preferenceSortKey === key}
          className={`tab ${preferenceSortKey === key ? 'tab-active' : ''}`}
          onClick={() => onPreferenceSortChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
    <div role="tablist" className="tabs tabs-box tabs-sm self-end bg-base-100 md:self-auto">
      {READING_SORT_TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={readingSortKey === key}
          className={`tab ${readingSortKey === key ? 'tab-active' : ''}`}
          onClick={() => onReadingSortChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
)
