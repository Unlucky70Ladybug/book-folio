import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import { searchBooks } from './_hooks/use-search-books'
import { NotificationContext } from '../providers/notification-provider';
import { type Book } from '../../types/book'

const SearchBook = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") ?? '';
  const keyword = searchParams.get("keyword") ?? '';
  const { notify } = useContext(NotificationContext)
  const [books, setBooks] = useState<Book[]>([])

  // クエリ(type / keyword)が変わるたびに検索を実行する
  useEffect(() => {
    if (!keyword && !type) return

    searchBooks(type, keyword)
      .then((result) => {
        setBooks(result)
      })
      .catch((err) => {
        notify(err instanceof Error ? err.message : '書籍検索に失敗しました', 'error')
      })
      
  }, [type, keyword, notify])

  console.log('books：', books)

  return (
    <div>
      {type} / {keyword}
      <p>{books.length}件</p>
    </div>
  )
}

export default SearchBook
