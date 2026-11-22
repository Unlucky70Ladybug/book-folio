import { useEffect, useState } from 'react'
import { getGenreStatisticsResult } from '../_hooks/get-genre-statistic'
import { getSimilarUserResult } from '../_hooks/get-similar-users'
import { getGenres } from '../../bookshelf/_hooks/get-genres'
import { useAuth } from '../../hooks/use-auth'
import { useNotification } from '../../hooks/use-notification'
import { type Bookshelf, type PreferenceRating } from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'
import { genreColor, type GenreSummary } from '../../../types/genre-statistic'
import { type SimilarUser } from '../../../types/user'
import { RatioChart, type RatioChartItem } from '../../components/chart/ratio-chart'
import { StatisticTabs } from '../../components/statistic-tabs'
import { EmptyState } from '../../components/empty-state'
import {
  SHELF_BOARD_HEIGHT,
  SHELF_ROW_HEIGHT,
  shelfStyle,
} from '../../components/shelf/shelf-style'
import { BookshelfBook } from '../../bookshelf/_components/bookshelf-book'
import { handleUpdated } from '../../bookshelf/_utils/handle-updated'
import Spinner from '../../components/layouts/ui/spinner'
import { UserComparisonTabs } from '../_components/user-comparison-tabs'
import defaultUserImage from '../../../assets/default_user_image.png'

// APIと同じく好み評価の高い順に並べるための順位
const RATING_RANK: Record<PreferenceRating, number> = {
  unrated: 0,
  not_for_me: 1,
  normal: 2,
  interesting: 3,
  favorite: 4,
}

const GenreStatistic = () => {
  const { currentUser } = useAuth()
  const { notify } = useNotification()
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([])
  const [genreList, setGenreList] = useState<Genre[]>([])
  const [comparisonUsers, setComparisonUsers] = useState<SimilarUser>({
    similar_users: [],
    middle_users: [],
    different_users: [],
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // この本の所有権
  const isOwner = true

  useEffect(() => {
    let ignore = false

    Promise.all([getGenreStatisticsResult(), getGenres(), getSimilarUserResult()])
      .then(([genreStatisticsResult, genresResult, similarUserResult]) => {
        if (ignore) return
        // 1冊が複数ジャンルに含まれるため、重複を除いた本棚の一覧にする
        const uniqueBookshelves = new Map<number, Bookshelf>()
        genreStatisticsResult.genres_books.forEach((genre) =>
          genre.bookshelves.forEach((b) => uniqueBookshelves.set(b.id, b)),
        )
        setBookshelves([...uniqueBookshelves.values()])
        setComparisonUsers(similarUserResult)
        setGenreList(genresResult)
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

  // 本棚の更新(handleUpdated)に追従させるため、ジャンルごとの本・件数・割合はbookshelvesから算出する(APIと同じく小数第1位で四捨五入)
  const bookshelvesByGenre = new Map<number, { genre: Genre; bookshelves: Bookshelf[] }>()
  ;[...bookshelves]
    .sort((a, b) => RATING_RANK[b.preference_rating] - RATING_RANK[a.preference_rating])
    .forEach((bookshelf) =>
      bookshelf.genres.forEach((genre) => {
        const group = bookshelvesByGenre.get(genre.id) ?? { genre, bookshelves: [] }
        group.bookshelves.push(bookshelf)
        bookshelvesByGenre.set(genre.id, group)
      }),
    )
  // ジャンルごとに分類された本棚の総数(重複を含む)
  const total = [...bookshelvesByGenre.values()].reduce((sum, g) => sum + g.bookshelves.length, 0)
  const summaries: GenreSummary[] = [...bookshelvesByGenre.values()]
    .sort((a, b) => b.bookshelves.length - a.bookshelves.length)
    .map(({ genre, bookshelves: genreBookshelves }, i) => ({
      id: genre.id,
      name: genre.name,
      books_count: genreBookshelves.length,
      ratio: total === 0 ? 0 : Math.round((genreBookshelves.length * 1000) / total) / 10,
      bookshelves: genreBookshelves,
      color: genreColor(i),
    }))

  const chartItems: RatioChartItem[] = summaries.map(
    ({ id, name, books_count, ratio, bookshelves, color }) => ({
      id,
      label: name,
      count: books_count,
      ratio,
      color,
      titles: bookshelves.map(({ book }) => book.title),
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
            {!isLoading && summaries.length > 0 && <StatisticTabs />}
            {isLoading ? null : summaries.length === 0 ? (
              <EmptyState
                title="まだジャンルの付いた本がありません"
                description="本棚の本にジャンルを設定すると、ここにジャンルの割合が表示されます"
              />
            ) : (
              /* 画面が広くても比較ユーザーが離れすぎないよう、円グラフと並べて中央に寄せる */
              <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-start md:justify-center">
                <div className="w-full md:max-w-176">
                  <RatioChart items={chartItems} />
                </div>
                <UserComparisonTabs users={comparisonUsers} />
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner message="ジャンル統計を読み込み中..." />
      ) : (
        <>
          {/* ジャンルごとの本棚 */}
          {summaries.map(({ id, name, books_count, ratio, bookshelves, color }) => (
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

export default GenreStatistic
