import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthorStatisticsResult } from '../_hooks/get-author-statistic'
import { getGenres } from '../../bookshelf/_hooks/get-genres'
import { useAuth } from '../../hooks/use-auth'
import { useNotification } from '../../hooks/use-notification'
import { type Bookshelf } from '../../../types/bookshelf'
import { type AuthorStatistics, type AuthorSummary } from '../../../types/author-statistic'
import { type Genre } from '../../../types/genre'
import { genreColor } from '../../../types/genre-statistic'
import { RatioChart, type RatioChartItem } from '../../components/chart/ratio-chart'
import { StatisticTabs } from '../../components/statistic-tabs'
import { EmptyState } from '../../components/empty-state'
import { BookshelfBook } from '../../bookshelf/_components/bookshelf-book'
import { handleUpdated } from '../../bookshelf/_utils/handle-updated'
import {
  SHELF_BOARD_HEIGHT,
  SHELF_ROW_HEIGHT,
  shelfStyle,
} from '../../components/shelf/shelf-style'
import Spinner from '../../components/layouts/ui/spinner'
import defaultUserImage from '../../../assets/default_user_image.png'

const AuthorStatistic = () => {
  const { currentUser } = useAuth()
  const { notify } = useNotification()
  const [authorStatistics, setAuthorStatistics] = useState<AuthorStatistics[]>([])
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([])
  const [genreList, setGenreList] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // この本の所有権
  const isOwner = true

  useEffect(() => {
    let ignore = false

    Promise.all([getAuthorStatisticsResult(), getGenres()])
      .then(([authorStatisticsResult, genresResult]) => {
        if (ignore) return
        setAuthorStatistics(authorStatisticsResult)
        // 更新(handleUpdated)で差し替える用に、本棚の一覧も持っておく
        setBookshelves(authorStatisticsResult.flatMap((statistic) => statistic.bookshelves))
        setGenreList(genresResult)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : '著作者統計の表示に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [notify])

  // 編集で著作者は変わらないため、グループ・件数・割合はAPIの集計結果をそのまま使い、本だけ最新のものに差し替える
  const latestBookshelfById = new Map(bookshelves.map((bookshelf) => [bookshelf.id, bookshelf]))
  const summaries: AuthorSummary[] = authorStatistics.map((statistic, i) => ({
    ...statistic,
    bookshelves: statistic.bookshelves.map(
      (bookshelf) => latestBookshelfById.get(bookshelf.id) ?? bookshelf,
    ),
    color: genreColor(i),
  }))

  const chartItems: RatioChartItem[] = summaries.map(
    ({ author, books_count, ratio, bookshelves, color }) => ({
      id: author,
      label: author,
      count: books_count,
      ratio,
      color,
      titles: bookshelves.map(({ book }) => book.title),
    }),
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ユーザー情報と著作者の割合 */}
      <div className="card card-border bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={currentUser?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
                </div>
              </div>
              <h3 className="card-title text-base">{currentUser?.name}さんの著作者統計</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:ml-auto">
              <span className="badge badge-primary badge-soft">著作者数 {summaries.length}</span>
            </div>
          </div>

          <div className="divider my-0" />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {!isLoading && summaries.length > 0 && <StatisticTabs />}
            {isLoading ? null : summaries.length === 0 ? (
              <EmptyState
                title="まだ本棚に本がありません"
                description="本を登録すると、ここに著作者の割合が表示されます"
              />
            ) : (
              /* ジャンル統計と円グラフの位置を揃えるため、比較ユーザー欄と同じ幅の余白を右に確保する */
              <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start md:justify-center">
                <div className="w-full md:max-w-176">
                  <RatioChart items={chartItems} />
                </div>
                <div className="hidden md:block md:w-64 md:shrink-0" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner message="著作者統計を読み込み中..." />
      ) : (
        <>
          {/* 著作者ごとの本棚 */}
          {summaries.map(({ author, books_count, ratio, bookshelves, color }) => (
            <section key={author} className="flex flex-col gap-3">
              <h2 className="flex items-center gap-3">
                <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-lg font-bold">{author}</span>
                <span className="badge badge-sm">{books_count}冊</span>
                <Link
                  to={`/search_book?type=author&keyword=${encodeURIComponent(author.split('/')[0].trim())}`}
                  className="link link-primary text-sm"
                >
                  この著者の本を探す
                </Link>
                <span className="ml-auto text-sm text-base-content/60 tabular-nums">{ratio}%</span>
              </h2>
              <div className="rounded-box border-[12px] border-[#7a4b24] shadow-xl">
                <div className="relative px-4 md:px-8" style={shelfStyle}>
                  <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {bookshelves.map((bookshelf) => (
                      <BookshelfBook
                        key={bookshelf.id}
                        bookshelf={bookshelf}
                        genreList={genreList}
                        rowHeight={SHELF_ROW_HEIGHT}
                        boardHeight={SHELF_BOARD_HEIGHT}
                        onUpdated={handleUpdated(setBookshelves)}
                        isOwner={isOwner}
                      />
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

export default AuthorStatistic
