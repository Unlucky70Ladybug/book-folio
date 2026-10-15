import { useEffect, useState } from 'react'
import { getGenreStatisticsResult } from '../_hooks/get-genre-statistic'
import { getSimilarUserResult } from '../_hooks/get-similar-users'
import { useAuth } from '../../hooks/use-auth'
import { type SimilarUser } from '../../../types/user'
import { useNotification } from '../../hooks/use-notification'
import {
  genreColor,
  type GenresBooks,
  type GenreStatistics,
  type GenreSummary,
} from '../../../types/genre-statistic'
import { RatioChart, type RatioChartItem } from '../../components/chart/ratio-chart'
import { StatisticTabs } from '../../components/statistic-tabs'
import { UserComparisonTabs } from '../_components/user-comparison-tabs'
import { ShelfBook } from '../../components/shelf/shelf-book'
import { shelfStyle } from '../../components/shelf/shelf-style'
import Spinner from '../../components/layouts/ui/spinner'
import defaultUserImage from '../../../assets/default_user_image.png'

const GenreStatistic = () => {
  const { currentUser } = useAuth()
  const { notify } = useNotification()
  const [genresBooks, setGenresBooks] = useState<GenresBooks[]>([])
  const [genreStatistics, setGenreStatistics] = useState<GenreStatistics[]>([])
  const [comparisonUsers, setComparisonUsers] = useState<SimilarUser>({
    similar_users: [],
    middle_users: [],
    different_users: [],
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false

    Promise.all([getGenreStatisticsResult(), getSimilarUserResult()])
      .then(([genreStatisticsResult, similarUserResult]) => {
        if (ignore) return
        setGenresBooks(genreStatisticsResult.genres_books)
        setGenreStatistics(genreStatisticsResult.genre_statistics)
        setComparisonUsers(similarUserResult)
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

  // 件数と割合はAPIの集計結果(genre_statistics)をそのまま使う
  const summaries: GenreSummary[] = [...genreStatistics].map((statistic, i) => ({
    ...statistic,
    books: genresBooks.find(({ id }) => id === statistic.id)?.books ?? [],
    color: genreColor(i),
  }))

  const chartItems: RatioChartItem[] = summaries.map(
    ({ id, name, books_count, ratio, books, color }) => ({
      id,
      label: name,
      count: books_count,
      ratio,
      color,
      titles: books.map(({ title }) => title),
    }),
  )

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

          <div className="divider my-0" />
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <StatisticTabs />
            {summaries.length > 0 && (
              <div className="flex-1">
                <RatioChart items={chartItems} />
              </div>
            )}
            {/* 円グラフの右上の余白に読書傾向の比較ユーザーを表示する */}
            {!isLoading && (
              <div className="md:ml-auto">
                <UserComparisonTabs users={comparisonUsers} />
              </div>
            )}
          </div>
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
                      <ShelfBook key={book.id} {...book} />
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
