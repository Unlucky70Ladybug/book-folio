import { useContext, useEffect, useState, type CSSProperties } from 'react'
import { getBookshelves } from '../_hooks/get-bookshelves'
import { getGenres } from '../_hooks/get-genres'
import { useAuth } from '../../hooks/use-auth'
import { NotificationContext } from '../../providers/notification-provider'
import { type Bookshelf, READING_STATUS_LABELS } from '../../../types/bookshelf'
import { BookshelfBook } from '../_components/bookshelf-book'
import {
  SHELF_BOARD_HEIGHT,
  SHELF_ROW_HEIGHT,
  shelfStyle,
} from '../../components/shelf/shelf-style'
import Spinner from '../../components/layouts/ui/spinner'
import defaultUserImage from '../../../assets/default_user_image.png'
import { type ReadingStatus } from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'

// 本が少なくても棚が2段分は見えるようにする
const bookshelfStyle: CSSProperties = { ...shelfStyle, minHeight: SHELF_ROW_HEIGHT * 2 }

const BookshelfPage = () => {
  const { currentUser } = useAuth()
  const { notify } = useContext(NotificationContext)
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([])
  const [genreList, setGenreList] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false

    Promise.all([getBookshelves(), getGenres()])
      .then(([bookshelvesResult, genresResult]) => {
        if (ignore) return
        setBookshelves(bookshelvesResult)
        setGenreList(genresResult)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : '本棚の表示に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [notify])

  const countByStatus = (status: ReadingStatus) =>
    bookshelves.filter((bookshelf) => bookshelf.reading_status === status).length

  // 更新成功後、該当の1冊だけ差し替える
  const handleUpdated = (updated_book: Bookshelf) => {
    setBookshelves((prev) => prev.map((b) => (b.id === updated_book.id ? updated_book : b)))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ユーザー情報 */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 rounded-full ring-4 ring-secondary/40 ring-offset-2 ring-offset-base-100">
                <img src={currentUser?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold">{currentUser?.name}の本棚</p>
              <p className="text-sm text-base-content/60">{currentUser?.name}さん</p>
            </div>
          </div>

          <div className="stats stats-horizontal bg-base-200 md:ml-auto">
            <div className="stat place-items-center px-4 md:px-6">
              <div className="stat-title">登録数</div>
              <div className="stat-value text-primary">{bookshelves.length}</div>
            </div>
            <div className="stat place-items-center px-4 md:px-6">
              <div className="stat-title">{READING_STATUS_LABELS.finished}</div>
              <div className="stat-value text-2xl">{countByStatus('finished')}</div>
            </div>
            <div className="stat place-items-center px-4 md:px-6">
              <div className="stat-title">{READING_STATUS_LABELS.reading}</div>
              <div className="stat-value text-2xl">{countByStatus('reading')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 本棚 */}
      {isLoading ? (
        <Spinner message="本棚を読み込み中..." />
      ) : (
        <div className="rounded-box border-[12px] border-[#7a4b24] shadow-xl">
          <div className="relative px-4 md:px-8" style={bookshelfStyle}>
            {bookshelves.length === 0 ? (
              <div
                className="flex items-end justify-center pb-14"
                style={{ height: SHELF_ROW_HEIGHT }}
              >
                <p className="rounded-field bg-base-100/85 px-4 py-2 text-sm shadow">
                  まだ本が登録されていません。本を検索して本棚に追加してみましょう！
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {bookshelves.map((bookshelf) => (
                  <BookshelfBook
                    key={bookshelf.id}
                    bookshelf={bookshelf}
                    genreList={genreList}
                    rowHeight={SHELF_ROW_HEIGHT}
                    boardHeight={SHELF_BOARD_HEIGHT}
                    onUpdated={handleUpdated}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookshelfPage
