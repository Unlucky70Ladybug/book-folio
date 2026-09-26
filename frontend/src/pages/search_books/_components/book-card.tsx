import { type Book } from '../../../types/book'

type BookCardProps = {
  book: Book
}

// 検索結果1件分の書籍カード
export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="card card-side card-border card-sm bg-base-100">
      <figure className="w-24 shrink-0 bg-base-200 p-2">
        {book.image_url ? (
          <img src={book.image_url} alt={book.title} className="h-auto w-full object-contain" />
        ) : (
          <span className="text-xs text-base-content/50">No Image</span>
        )}
      </figure>

      <div className="card-body min-w-0">
        <h2 className="card-title line-clamp-2">{book.title}</h2>
        <p className="text-sm text-base-content/70">{book.author}</p>
        <p className="text-xs text-base-content/60">
          {book.publisher}
          {book.sales_date && ` / ${book.sales_date}`}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60">
          {book.size && <span className="badge badge-ghost badge-sm">{book.size}</span>}
          <span>ISBN: {book.isbn}</span>
        </div>
        {/* レビューが1件以上あるときだけ評価を表示 */}
        {book.review_count > 0 && (
          <p className="text-xs text-base-content/70">
            <span className="text-warning">★</span> {Number(book.review_average).toFixed(1)}
            <span className="text-base-content/50">（{book.review_count}件）</span>
          </p>
        )}

        <div className="card-actions justify-end">
          <a href={book.item_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            楽天で見る
          </a>
        </div>
      </div>
    </div>
  )
}
