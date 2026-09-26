import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchBooks } from './_hooks/use-search-books'
import { NotificationContext } from '../providers/notification-provider'
import { type Book } from '../../types/book'
import Spinner from '../components/layouts/ui/spinner'
import BookCard from './_components/book-card'

const SearchBook = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') ?? ''
  const keyword = searchParams.get('keyword') ?? ''
  const { notify } = useContext(NotificationContext)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 検索条件が変わったらレンダー中にローディング状態へ戻す
  // (effect内で同期的にsetStateすると再レンダーが連鎖するため)
  const query = `${type}:${keyword}`
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setIsLoading(true)
  }

  // クエリ(type / keyword)が変わるたびに検索を実行する
  useEffect(() => {
    if (!keyword && !type) return

    let ignore = false

    searchBooks(type, keyword)
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
    }
  }, [type, keyword, notify])

  // 検索条件がない場合は検索自体が走らないため、スピナーより先に判定する
  if (!keyword && !type) {
    return (
      <p className="py-10 text-center text-base-content/70">検索キーワードを入力してください</p>
    )
  }

  if (isLoading) return <Spinner message="検索中..." />

  if (books.length === 0) {
    return <p className="py-10 text-center text-base-content/70">検索結果がありませんでした</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70">
        「{keyword}」の検索結果：{books.length}件
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>
    </div>
  )
}

export default SearchBook
