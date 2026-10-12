import { useEffect, useState, type CSSProperties } from 'react'
import { getGenreStatisticsResult } from '../_hooks/get-genre-statistic'
import { useAuth } from '../../hooks/use-auth'
import { useNotification } from '../../hooks/use-notification'
import {
  genreColor,
  type GenresBooks,
  type GenreStatistics,
  type GenreSummary,
} from '../../../types/genre-statistic'
import { GenreChart } from '../_components/genre-chart'
import { GenreBook, SHELF_BOARD_HEIGHT, SHELF_ROW_HEIGHT } from '../_components/genre-book'
import Spinner from '../../components/layouts/ui/spinner'
import defaultUserImage from '../../../assets/default_user_image.png'

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
  minHeight: SHELF_ROW_HEIGHT,
}

const GenreStatistic = () => {
  const { currentUser } = useAuth()
  const { notify } = useNotification()
  const [genresBooks, setGenresBooks] = useState<GenresBooks[]>([])
  const [genreStatistics, setGenreStatistics] = useState<GenreStatistics[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false

    getGenreStatisticsResult()
      .then((genreStatisticsResult) => {
        if (ignore) return
        setGenresBooks(genreStatisticsResult.genres_books)
        setGenreStatistics(genreStatisticsResult.genre_statistics)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : 'ジャンル統計の表示に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [notify])

  // 件数と割合はAPIの集計結果(genre_statistics)をそのまま使い、冊数の多い順に表示する
  const summaries: GenreSummary[] = [...genreStatistics]
    .map((statistic, i) => ({
      ...statistic,
      books: genresBooks.find(({ id }) => id === statistic.id)?.books ?? [],
      color: genreColor(i),
    }))

  return (
    <div className="flex flex-col gap-6">
      {/* ユーザー情報とジャンルの割合 */}
      <div className="card card-border bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={currentUser?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
                </div>
              </div>
              <h3 className="card-title text-base">{currentUser?.name}さんのジャンル統計</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:ml-auto">
              <span className="badge badge-primary badge-soft">ジャンル数 {summaries.length}</span>
            </div>
          </div>

          {summaries.length > 0 && (
            <>
              <div className="divider my-0" />
              <GenreChart summaries={summaries} />
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <Spinner message="ジャンル統計を読み込み中..." />
      ) : summaries.length === 0 ? (
        <div role="alert" className="alert">
          <span>まだジャンルの付いた本がありません。本棚の本にジャンルを設定してみましょう！</span>
        </div>
      ) : (
        <>
          {/* ジャンルごとの本棚 */}
          {summaries.map(({ id, name, books_count, ratio, books, color }) => (
            <section key={id} className="flex flex-col gap-3">
              <h2 className="flex items-center gap-3">
                <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-lg font-bold">{name}</span>
                <span className="badge badge-sm">{books_count}冊</span>
                <span className="ml-auto text-sm text-base-content/60 tabular-nums">{ratio}%</span>
              </h2>
              <div className="rounded-box border-[12px] border-[#7a4b24] shadow-xl">
                <div className="relative px-4 md:px-8" style={shelfStyle}>
                  <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {books.map((book) => (
                      <GenreBook key={book.id} {...book} />
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}

export default GenreStatistic
