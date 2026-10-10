import { PREFERENCE_RATING_LABELS } from '../../../types/bookshelf'
import { type BookUndiagnosedPreference } from '../../../types/preference'
import {
  PREFERENCE_RATING_OPTIONS,
  type SelectableRating,
} from '../../components/bookshelf/fields/options'

type RatingCardProps = {
  book: BookUndiagnosedPreference
  submittingRating: SelectableRating | null
  // 渡さないときは操作できないカード(スライドで出ていく側)として表示する
  onSelect?: (rating: SelectableRating) => void
}

// 評価する本と、評価の選択肢(合わなかった → お気に入り)を表示するカード
export const RatingCard = ({ book, submittingRating, onSelect }: RatingCardProps) => (
  <div className="card card-border bg-base-100 sm:card-side">
    <figure className="shrink-0 bg-base-200 p-4">
      <img
        src={book.book.large_image_url}
        alt={book.book.title}
        className="h-48 w-auto max-w-36 rounded-sm object-cover shadow-md sm:h-56 sm:max-w-40"
      />
    </figure>
    <div className="card-body min-w-0">
      <h2 className="card-title text-base">{book.book.title}</h2>
      <p className="text-sm text-base-content/60">{book.book.author}</p>
      <div className="flex flex-wrap gap-1">
        {book.genres.map((genre) => (
          <span key={genre.id} className="badge badge-ghost badge-sm">
            {genre.name}
          </span>
        ))}
      </div>
      <div className="divider my-0 text-xs text-base-content/60">この本はどうでしたか？</div>
      <div className="card-actions grid grid-cols-2 gap-2">
        {PREFERENCE_RATING_OPTIONS.map(({ value, color }) => (
          <button
            key={value}
            type="button"
            className={`btn btn-sm ${color}`}
            disabled={!onSelect || submittingRating !== null}
            onClick={() => onSelect?.(value)}
          >
            {submittingRating === value && <span className="loading loading-spinner loading-xs" />}
            {PREFERENCE_RATING_LABELS[value]}
          </button>
        ))}
      </div>
    </div>
  </div>
)
