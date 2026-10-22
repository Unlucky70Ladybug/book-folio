import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { type ApiBook } from '../../../types/book'
import { type PostsResponse } from '../../../types/post'
import { getPostsResult } from '../_hooks/get-posts'
import { useGenres } from '../../bookshelf/_hooks/use-genres'
import { useNotification } from '../../hooks/use-notification'
import PostBookshelfForm from '../_components/post-bookshelf-form'
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

  return (
    <div className="flex flex-col gap-6">
      {/* 本棚に登録するフォーム。取得した登録内容を初期値にするためkeyで作り直す */}
      <PostBookshelfForm
        key={currentUserInfo?.id ?? 'new'}
        book={book}
        genreList={genreList}
        currentUserInfo={currentUserInfo}
      />

      {/* コメント一覧 */}
      <div className="card card-border bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center gap-2">
            <h3 className="card-title text-lg">みんなのコメント</h3>
            <span className="badge badge-primary badge-soft">{postsResult?.post_count ?? 0}件</span>
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
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={user.avatar_image?.url ?? defaultUserImage}
                        alt={`${user.name}さんのアイコン`}
                      />
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{user.name}</p>
                      {genres.map((genre) => (
                        <span key={genre.id} className="badge badge-sm badge-ghost">
                          {genre.name}
                        </span>
                      ))}
                    </div>

                    {/* ネタバレありのコメントは開いたときだけ表示する */}
                    {post.has_spoiler ? (
                      <details className="collapse collapse-arrow border border-warning/40 bg-warning/5">
                        <summary className="collapse-title py-2 text-sm text-warning">
                          ネタバレを含むコメントを表示
                        </summary>
                        <p className="collapse-content text-sm break-words whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </details>
                    ) : (
                      <p className="text-sm break-words whitespace-pre-wrap">{post.content}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookPosts
