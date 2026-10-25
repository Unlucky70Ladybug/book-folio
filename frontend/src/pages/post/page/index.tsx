import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { type ApiBook } from '../../../types/book'
import { type PostsResponse } from '../../../types/post'
import { getPostsResult } from '../_hooks/get-posts'
import { useGenres } from '../../bookshelf/_hooks/use-genres'
import { useNotification } from '../../hooks/use-notification'
import PostBookshelfForm from '../_components/post-bookshelf-form'
import { PostComment } from '../_components/post-comment'
import { EmptyState } from '../../components/empty-state'
import Spinner from '../../components/layouts/ui/spinner'
import defaultUserImage from '../../../assets/default_user_image.png'

// 本の登録フォームと、他のユーザーのコメント一覧を表示するページ
const BookPosts = () => {
  const { notify } = useNotification()
  const location = useLocation()
  // URLを直接開いた場合はstateが無いのでundefinedになる
  const book: ApiBook | undefined = location.state?.book
  const genreList = useGenres()
  const [postsResult, setPostsResult] = useState<PostsResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(!!book)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!book) return

    let ignore = false

    getPostsResult(book.isbn)
      .then((result) => {
        if (!ignore) setPostsResult(result)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : 'コメントの取得に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [book, notify])

  if (!book)
    return (
      <EmptyState title="本が見つかりません" description="検索画面から本を選び直してください" />
    )

  if (isLoading) return <Spinner message="コメントを読み込み中" />

  const currentUserInfo = postsResult?.current_user_info ?? null
  const posts = postsResult?.posts ?? []

  const isRegistered = currentUserInfo !== null

  return (
    <div className="card card-border bg-base-100 shadow-sm">
      <div className="card-body">
        {/* 両端に広がらないよう幅を絞って中央に寄せる */}
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 sm:flex-row">
          {/* 左側：書影・タイトル・著者・登録状況・登録ボタン */}
          <div className="flex shrink-0 flex-row items-start gap-4 sm:w-[240px] sm:flex-col sm:items-center">
            <figure className="flex h-[200px] w-[140px] shrink-0 items-center justify-center overflow-hidden rounded-box bg-base-200 shadow-md">
              {book.image_url ? (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xs text-base-content/50">No Image</span>
              )}
            </figure>

            <div className="flex min-w-0 flex-col items-start gap-2 sm:items-center sm:text-center">
              <p className="line-clamp-3 text-xl font-bold leading-snug">{book.title}</p>
              <p className="text-base text-base-content/70">{book.author}</p>
              {isRegistered ? (
                <span className="badge badge-success gap-1 font-semibold">登録済み</span>
              ) : (
                <span className="badge badge-ghost">未登録</span>
              )}
              <button
                type="button"
                className="btn btn-sm btn-primary mt-1"
                onClick={() => dialogRef.current?.showModal()}
              >
                {isRegistered ? '登録内容を編集' : '本棚に登録'}
              </button>
            </div>
          </div>

          {/* 右側：コメント一覧 */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <h3 className="card-title text-lg">みんなのコメント</h3>
              <span className="badge badge-primary badge-soft">
                {postsResult?.post_count ?? 0}件
              </span>
            </div>

            {posts.length === 0 ? (
              <EmptyState
                title="まだコメントがありません"
                description="他のユーザーがコメントするとここに表示されます"
              />
            ) : (
              <ul className="list">
                {posts.map(({ user, genres, post }) => (
                  <li key={post.id} className="list-row items-start">
                    {/* アイコンからもその人の本棚へ移動できるようにする */}
                    <Link to={`/bookshelf/${user.id}`} className="avatar self-start">
                      <div className="w-10 rounded-full">
                        <img
                          src={user.avatar_image?.url ?? defaultUserImage}
                          alt={`${user.name}さんのアイコン`}
                        />
                      </div>
                    </Link>

                    <div className="list-col-grow flex min-w-0 flex-col gap-2">
                      {/* ユーザー名の右側にジャンルを並べる */}
                      <div className="flex items-center gap-2">
                        {/* ユーザー名からその人の本棚へ移動できるようにする */}
                        <Link
                          to={`/bookshelf/${user.id}`}
                          className="link link-hover shrink-0 font-semibold"
                        >
                          {user.name}
                        </Link>
                        <div className="flex min-w-0 flex-wrap gap-1">
                          {genres.map((genre) => (
                            <span key={genre.id} className="badge badge-sm badge-ghost">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <PostComment content={post.content} hasSpoiler={!!post.has_spoiler} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 本棚に登録・編集するモーダル。取得した登録内容を初期値にするためkeyで作り直す */}
      <PostBookshelfForm
        key={currentUserInfo?.id ?? 'new'}
        book={book}
        dialogRef={dialogRef}
        genreList={genreList}
        currentUserInfo={currentUserInfo}
      />
    </div>
  )
}

export default BookPosts
