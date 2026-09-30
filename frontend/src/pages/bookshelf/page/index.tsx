import { useContext, useEffect, useState, type CSSProperties } from 'react'
import { getBookshelves } from '../_hooks/get-bookshelves'
import { useAuth } from '../../hooks/use-auth'
import { NotificationContext } from '../../providers/notification-provider'
import { type Bookshelf, READING_STATUS_LABELS } from '../../../types/bookshelf'
import { BookshelfBook } from '../_components/bookshelf-book'
import Spinner from '../../components/layouts/ui/spinner'
import defaultUserImage from '../../../assets/default_user_image.png'
import { type ReadingStatus } from '../../../types/bookshelf'

// 1段の高さ(本 + 棚板)。背景の棚板の間隔と本の配置をこの値で揃える
const SHELF_ROW_HEIGHT = 240
const SHELF_BOARD_HEIGHT = 40

// 木目の背板と、一定間隔で並ぶ棚板を背景として描画する
const shelfStyle: CSSProperties = {
  backgroundImage: [
    // 棚板(上面のハイライト + 前面 + 下の影)
    `repeating-linear-gradient(to bottom,
      transparent 0 ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT}px,
      #e0a96d ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT}px ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT + 6}px,
      #b87a42 ${SHELF_ROW_HEIGHT - SHELF_BOARD_HEIGHT + 6}px ${SHELF_ROW_HEIGHT - 4}px,
      #7a4b24 ${SHELF_ROW_HEIGHT - 4}px ${SHELF_ROW_HEIGHT}px)`,
    // 背板の木目
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 9px, rgba(255,255,255,0.03) 9px 11px, transparent 11px 23px)',
    // 背板の奥行き(上下を少し暗く)
    'linear-gradient(to bottom, rgba(60,30,10,0.25), transparent 15%, transparent 85%, rgba(60,30,10,0.2))',
  ].join(','),
  backgroundColor: '#a86d3a',
  minHeight: SHELF_ROW_HEIGHT * 2,
}

const BookshelfPage = () => {
  const { currentUser } = useAuth()
  const { notify } = useContext(NotificationContext)
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false

    getBookshelves()
      .then((result) => {
        if (!ignore) setBookshelves(result)
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
          <div className="relative px-4 md:px-8" style={shelfStyle}>
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
