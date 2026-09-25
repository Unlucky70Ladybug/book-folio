import { useState, type FormEvent, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { type SearchBookData, type SearchType } from '../../../types/book'
import { NotificationContext } from '../../providers/notification-provider'

type BookSearchFormProps = {
  formData?: SearchBookData
}

const DEFAULT_FORM_DATA: SearchBookData = { keyword: '', type: 'title' }

const SEARCH_TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'title', label: 'タイトル' },
  { value: 'author', label: '著者' },
  { value: 'isbn', label: 'ISBN' },
]

export default function BookSearchForm({
  formData = DEFAULT_FORM_DATA,
}: BookSearchFormProps){

  const [searchKeyword, setSearchKeyword] = useState(formData.keyword)
  const [searchType, setSearchType] = useState<SearchType>(formData.type)
  const { notify } = useContext(NotificationContext)
  const navigate = useNavigate()

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!searchKeyword.trim()) {
      notify('検索内容を入れてください', 'warning')
      return 
    }
    navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}&type=${searchType}`)
  }

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="hidden items-center gap-2 sm:flex"
    >
      <div className="join w-full">
        <select
          className="select select-sm join-item w-24 border-base-content/30 focus:outline-none focus-within:outline-none open:outline-none"
          aria-label="検索条件"
          value={searchType} /* searchTypeの値によって、選択中のoptionが決まる */
          onChange={(event) => setSearchType(event.target.value as SearchType)}
        >
          {SEARCH_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="input input-sm join-item w-full border-base-content/30 focus:outline-none focus-within:outline-none">
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
            placeholder="本を検索"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="btn btn-primary btn-sm">
        検索
      </button>
    </form>
  )
}
