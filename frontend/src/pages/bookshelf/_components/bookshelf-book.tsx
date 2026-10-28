import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { type Bookshelf, type PreferenceRating } from '../../../types/bookshelf'
import ShowBookshelfModal from './show-bookshelf'
import { type Genre } from '../../../types/genre'

// 好み評価を星の数に変換(未評価は星を表示しない)
const RATING_STARS: Record<PreferenceRating, number> = {
  unrated: 0,
  not_for_me: 1,
  normal: 2,
  interesting: 3,
  favorite: 4,
}
const MAX_STARS = 4

type BookshelfBookProps = {
  bookshelf: Bookshelf
  genreList: Genre[]
  rowHeight: number
  boardHeight: number
  onUpdated: (bookshelf: Bookshelf) => void
  isOwner: boolean
}

// 棚に並ぶ1冊分(表紙 + 棚板上の評価)
export const BookshelfBook = ({
  bookshelf,
  genreList,
  rowHeight,
  boardHeight,
  onUpdated,
  isOwner,
}: BookshelfBookProps) => {
  const { book, preference_rating } = bookshelf
  const stars = RATING_STARS[preference_rating]
  const dialogRef = useRef<HTMLDialogElement>(null)

  // 書影はボタン・リンクのどちらでも同じ見た目にする
  const cover = (
    <img
      src={book.large_image_url}
      alt={book.title}
      loading="lazy"
      className="h-40 w-auto max-w-24 rounded-sm object-cover shadow-[3px_4px_8px_rgba(0,0,0,0.45)] md:max-w-28"
    />
  )
  const coverClassName =
    'block cursor-pointer transition-transform duration-200 hover:-translate-y-2'

  return (
    <li className="flex flex-col items-center justify-end" style={{ height: rowHeight }}>
      <div className="tooltip" data-tip={`${book.title} / ${book.author}`}>
        {isOwner ? (
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className={coverClassName}
          >
            {cover}
          </button>
        ) : (
          // 他ユーザーの本棚では編集させず、この本のコメント一覧へ移動する
          <Link
            to={`/books/${book.isbn}/posts`}
            state={{ book: { ...book, image_url: book.large_image_url } }}
            className={coverClassName}
          >
            {cover}
          </Link>
        )}
      </div>
      {isOwner && (
        <ShowBookshelfModal
          bookshelf={bookshelf}
          genreList={genreList}
          dialogRef={dialogRef}
          onUpdated={onUpdated}
        />
      )}
      <div className="flex items-center" style={{ height: boardHeight }}>
        {stars > 0 && (
          <div className="rating rating-xs" aria-label={`評価 ${stars} / ${MAX_STARS}`}>
            {Array.from({ length: MAX_STARS }, (_, i) => (
              <div
                key={i}
                className="mask mask-star-2 bg-amber-300"
                aria-current={i + 1 === stars ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </li>
  )
}
