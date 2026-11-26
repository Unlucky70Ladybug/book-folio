import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNotification } from '../../hooks/use-notification'
import {
  type TimeLinesBookshelf,
  READING_STATUS_LABELS,
  PREFERENCE_RATING_LABELS,
} from '../../../types/bookshelf'
import { type RelationshipStats } from '../../../types/relationship'
import { type Genre } from '../../../types/genre'
import { postFollow } from '../../relationship/_hooks/post-follow'
import { deleteFollow } from '../../relationship/_hooks/delete-follow'
import UnFollowButton from '../../relationship/_components/unfollow'
import FollowButton from '../../relationship/_components/follow'
import AddToBookshelfButton from '../../components/bookshelf/add-to-bookshelf-button'
import ShowBookshelfModal from '../../bookshelf/_components/show-bookshelf'
import defaultUserImage from '../../../assets/default_user_image.png'

type TimeLineBookshelfProps = {
  timeLine: TimeLinesBookshelf
  // 同じユーザーの投稿が複数あるため、フォロー状態の更新は親でまとめて行う
  onFollowStatusChange: (userId: number, followStatus: boolean) => void
  genreList: Genre[]
  // 本棚に登録したらタイムラインを更新する
  onRegistered: () => void
}

// タイムラインの1件分(誰がどの本を本棚に登録したか)
const TimeLineBookshelf = ({
  timeLine,
  onFollowStatusChange,
  genreList,
  onRegistered,
}: TimeLineBookshelfProps) => {
  const { bookshelf, user, follow_status } = timeLine
  const { book, genres } = bookshelf
  const { notify } = useNotification()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isRelationshipLoading, setIsRelationshipLoading] = useState<boolean>(false)

  const handleFollowToggle = async (
    action: (id: number) => Promise<RelationshipStats>,
    message: string,
  ) => {
    if (!user?.id) return
    setIsRelationshipLoading(true)
    try {
      await action(user.id)
      // 成功したらフォロー状態は現在の反対になる
      onFollowStatusChange(user.id, !follow_status)
      notify(message, 'success')
    } catch {
      notify('操作に失敗しました', 'error')
    } finally {
      setIsRelationshipLoading(false)
    }
  }

  return (
    // 投稿ごとの境界が分かるように枠で囲む
    <li className="card card-border bg-base-100 mx-auto w-full max-w-2xl shadow-sm">
      <div className="card-body gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* アイコンからその人の本棚へ移動できるようにする */}
          <Link to={`/bookshelf/${user.id}`} className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={user.avatar_image?.url ?? defaultUserImage}
                alt={`${user.name}さんのアイコン`}
              />
            </div>
          </Link>
          <Link to={`/bookshelf/${user.id}`} className="link link-hover font-semibold">
            {user.name}
          </Link>
          {follow_status === null && (
            <span className="badge badge-sm badge-neutral">自分</span>
          )}
          {follow_status === false && (
            <FollowButton
              onClick={() => handleFollowToggle(postFollow, 'フォローしました')}
              isLoading={isRelationshipLoading}
            />
          )}
          {follow_status === true && (
            <UnFollowButton
              onClick={() => handleFollowToggle(deleteFollow, 'フォローを解除しました')}
              isLoading={isRelationshipLoading}
            />
          )}
        </div>

        <div className="flex gap-5">
          {/* 拡大すると画像が粗くなるため、表紙は保存されている大きさのまま表示する */}
          {book.large_image_url ? (
            <figure className="shrink-0 self-start">
              <img
                src={book.large_image_url}
                alt={book.title}
                className="rounded-box shadow-md"
              />
            </figure>
          ) : (
            <figure className="flex h-48 w-32 shrink-0 items-center justify-center rounded-box bg-base-200">
              <span className="text-sm text-base-content/50">No Image</span>
            </figure>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {/* ユーザーが付けたジャンルはタイトルの上に表示する */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {genres.map((genre) => (
                  <span key={genre.id} className="badge badge-sm badge-ghost">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            <a
              href={book.item_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover line-clamp-2 text-lg font-bold"
            >
              {book.title}
            </a>
            {/* 作者名はホバーした時だけ色と下線を付ける */}
            <Link
              to={`/search_book?type=author&keyword=${encodeURIComponent(book.author.split('/')[0].trim())}`}
              className="link link-hover text-sm text-base-content/70 hover:text-primary"
            >
              {book.author}
            </Link>
            {/* 感想を読書ステータスより左に表示する */}
            <div className="flex flex-wrap gap-1">
              {bookshelf.preference_rating !== 'unrated' && (
                <span className="badge badge-secondary badge-soft">
                  {PREFERENCE_RATING_LABELS[bookshelf.preference_rating]}
                </span>
              )}
              <span className="badge badge-primary">
                {READING_STATUS_LABELS[bookshelf.reading_status]}
              </span>
            </div>

            {/* 自分の投稿は本棚の内容を編集し、他人の投稿は自分の本棚に登録する */}
            {/* 「編集」と「本棚に登録」の大きさを揃えるため、同じ幅の枠に入れる */}
            <div className="mt-auto w-full pt-2 sm:w-48">
              {follow_status === null ? (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline w-full"
                    onClick={() => dialogRef.current?.showModal()}
                  >
                    編集
                  </button>
                  <ShowBookshelfModal
                    bookshelf={bookshelf}
                    genreList={genreList}
                    dialogRef={dialogRef}
                    onUpdated={onRegistered}
                  />
                </>
              ) : (
                <AddToBookshelfButton
                  book={{
                    isbn: book.isbn,
                    title: book.title,
                    author: book.author,
                    item_url: book.item_url,
                    // 保存済みの本は書影の名前が違うため合わせる
                    image_url: book.large_image_url,
                  }}
                  genreList={genreList}
                  onRegistered={onRegistered}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default TimeLineBookshelf
