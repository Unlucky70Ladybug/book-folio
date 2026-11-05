import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchBooks } from './_hooks/use-search-books'
import { useGenres } from '../bookshelf/_hooks/use-genres'
import { NotificationContext } from '../providers/notification-provider'
import { type ApiBook } from '../../types/book'
import Spinner from '../components/layouts/ui/spinner'
import BookCard from './_components/book-card'
import Pagination from '../auth/_components/pagination'

const SearchBook = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') ?? ''
  const keyword = searchParams.get('keyword') ?? ''
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { notify } = useContext(NotificationContext)
  const [books, setBooks] = useState<ApiBook[]>([])
  const genreList = useGenres()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const nextPage = () => setCurrentPage((prev) => prev + 1)
  const prevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))

  // 検索条件が変わったらレンダー中にローディング状態へ戻す
  // (effect内で同期的にsetStateすると再レンダーが連鎖するため)
  const query = `${type}:${keyword}`
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setIsLoading(true)
    setCurrentPage(1)
  }

  // クエリ(type / keyword)が変わるたびに検索を実行する
  useEffect(() => {
    if (!keyword && !type) return

    let ignore = false

    searchBooks(type, keyword, currentPage)
      .then((result) => {
        if (!ignore) setBooks(result)
      })
      .catch((err) => {
        if (!ignore) notify(err instanceof Error ? err.message : '書籍検索に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    // クリーンアップをし古いリクエストの結果は表示しない
    return () => {
      ignore = true
      setIsLoading(true)
    }
  }, [type, keyword, currentPage, notify])

  // 検索条件がない場合は検索自体が走らないため、スピナーより先に判定する
  if (!keyword && !type) {
    return (
      <p className="py-10 text-center text-base-content/70">検索キーワードを入力してください</p>
    )
  }

  if (isLoading) return <Spinner message="検索中..." />

  if (books.length === 0) {
    return (
      <div className="flex flex-col gap-3 pt-2 pb-8">
        {currentPage > 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-base-content/70">
              「<span className="font-semibold text-base-content">{keyword}</span>」の検索結果
              <span className="badge badge-primary badge-soft ml-2">{books.length}件</span>
            </p>
            <Pagination currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} lastPage={true} />
          </div>
        )}
        <p className="py-10 text-center text-base-content/70">検索結果がありませんでした</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 pt-2 pb-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-base-content/70">
          「<span className="font-semibold text-base-content">{keyword}</span>」の検索結果
          <span className="badge badge-primary badge-soft ml-2">{books.length}件</span>
        </p>
        <Pagination currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.isbn} book={book} genreList={genreList} />
        ))}
      </div>
      <div className="divider my-0" />
      <Pagination currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} />
    </div>
  )
}

export default SearchBook
