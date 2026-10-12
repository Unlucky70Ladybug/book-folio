import { useEffect, useState } from 'react'
import { getAuthorStatisticsResult } from '../_hooks/get-author-statistic'
import { useAuth } from '../../hooks/use-auth'
import { useNotification } from '../../hooks/use-notification'
import { type AuthorStatistics } from '../../../types/author-statistic'
import { genreColor } from '../../../types/genre-statistic'
import { RatioChart, type RatioChartItem } from '../../components/chart/ratio-chart'
import { ShelfBook } from '../../components/shelf/shelf-book'
import { shelfStyle } from '../../components/shelf/shelf-style'
import Spinner from '../../components/layouts/ui/spinner'
import defaultUserImage from '../../../assets/default_user_image.png'

const AuthorStatistic = () => {
  const { currentUser } = useAuth()
  const { notify } = useNotification()
  const [authorStatistics, setAuthorStatistics] = useState<AuthorStatistics[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false

    getAuthorStatisticsResult()
      .then((authorStatisticsResult) => {
        if (ignore) return
        setAuthorStatistics(authorStatisticsResult)
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

  // 件数と割合はAPIの集計結果をそのまま使う
  const summaries = authorStatistics.map((statistic, i) => ({
    ...statistic,
    color: genreColor(i),
  }))

  const chartItems: RatioChartItem[] = summaries.map(
    ({ author, books_count, ratio, books, color }) => ({
      id: author,
      label: author,
      count: books_count,
      ratio,
      color,
      titles: books.map(({ title }) => title),
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

          {summaries.length > 0 && (
            <>
              <div className="divider my-0" />
              <RatioChart items={chartItems} />
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <Spinner message="著作者統計を読み込み中..." />
      ) : summaries.length === 0 ? (
        <div role="alert" className="alert">
          <span>まだ本棚に本がありません。本を登録してみましょう！</span>
        </div>
      ) : (
        <>
          {/* 著作者ごとの本棚 */}
          {summaries.map(({ author, books_count, ratio, books, color }) => (
            <section key={author} className="flex flex-col gap-3">
              <h2 className="flex items-center gap-3">
                <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-lg font-bold">{author}</span>
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

export default AuthorStatistic
