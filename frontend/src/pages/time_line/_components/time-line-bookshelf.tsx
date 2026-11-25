import { Link } from 'react-router-dom'
import {
  type TimeLinesBookshelf,
  READING_STATUS_LABELS,
  PREFERENCE_RATING_LABELS,
} from '../../../types/bookshelf'
import defaultUserImage from '../../../assets/default_user_image.png'

type TimeLineBookshelfProps = {
  timeLine: TimeLinesBookshelf
}

// タイムラインの1件分(誰がどの本を本棚に登録したか)
const TimeLineBookshelf = ({ timeLine }: TimeLineBookshelfProps) => {
  const { bookshelf, follow_status } = timeLine
  const { user, book, genres } = bookshelf

  return (
    <li className="list-row items-start">
      {/* アイコンからその人の本棚へ移動できるようにする */}
      <Link to={`/bookshelf/${user.id}`} className="avatar self-start">
        <div className="w-10 rounded-full">
          <img
            src={user.avatar_image?.url ?? defaultUserImage}
            alt={`${user.name}さんのアイコン`}
          />
        </div>
      </Link>

      <div className="list-col-grow flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/bookshelf/${user.id}`} className="link link-hover font-semibold">
            {user.name}
          </Link>
          {follow_status === null ? (
            <span className="badge badge-sm badge-neutral">自分</span>
          ) : (
            follow_status && (
              <span className="badge badge-sm badge-info badge-soft">フォロー中</span>
            )
          )}
        </div>

        <div className="flex gap-3">
          <figure className="flex h-[96px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-box bg-base-200">
            {book.large_image_url ? (
              <img
                src={book.large_image_url}
                alt={book.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xs text-base-content/50">No Image</span>
            )}
          </figure>

          <div className="flex min-w-0 flex-col gap-1">
            <a
              href={book.item_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover line-clamp-2 font-bold"
            >
              {book.title}
            </a>
            <p className="text-sm text-base-content/70">{book.author}</p>
            <div className="flex flex-wrap gap-1">
              <span className="badge badge-sm badge-primary">
                {READING_STATUS_LABELS[bookshelf.reading_status]}
              </span>
              {bookshelf.preference_rating !== 'unrated' && (
                <span className="badge badge-sm badge-secondary badge-soft">
                  {PREFERENCE_RATING_LABELS[bookshelf.preference_rating]}
                </span>
              )}
              {genres.map((genre) => (
                <span key={genre.id} className="badge badge-sm badge-ghost">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default TimeLineBookshelf
