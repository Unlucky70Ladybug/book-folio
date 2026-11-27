import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTimeLine } from '../_hooks/get-time-lines'
import { getGenres } from '../../bookshelf/_hooks/get-genres'
import { useNotification } from '../../hooks/use-notification'
import { type TimeLinesBookshelf } from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'
import { EmptyState } from '../../components/empty-state'
import Spinner from '../../components/layouts/ui/spinner'
import TimeLineBookshelf from '../_components/time-line-bookshelf'
import Pagination from '../../auth/_components/pagination'

// 1ページあたりの取得件数(バックエンドの per と合わせる)
const PER_PAGE = 10

// みんなの本棚への登録を新しい順に表示するページ
const TimeLine = () => {
  const { notify } = useNotification()
  const [searchParams, setSearchParams] = useSearchParams()
  // ページ番号はURLの?page=を唯一の情報源とする
  const currentPage = Math.max(1, Math.floor(Number(searchParams.get('page'))) || 1)

  const [timeLinesBookshelf, setTimeLinesBookshelf] = useState<TimeLinesBookshelf[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [genreList, setGenreList] = useState<Genre[]>([])
  // 読み込みが終わったページ番号。currentPageと違う間は読み込み中とみなす
  const [loadedPage, setLoadedPage] = useState<number | null>(null)
  const isLoading = loadedPage !== currentPage

  const goToPage = (page: number) => {
    setSearchParams({ page: String(page) })
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    let ignore = false

    Promise.all([getTimeLine(currentPage), getGenres()])
      .then(([timeLines, genresResult]) => {
        if (ignore) return
        setTimeLinesBookshelf(timeLines.result)
        setTotalCount(timeLines.total_count)
        setGenreList(genresResult)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : 'タイムラインの取得に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setLoadedPage(currentPage)
      })

    return () => {
      ignore = true
    }
  }, [notify, currentPage])

  // 同じユーザーの投稿すべてのフォロー状態をまとめて更新する
  const handleFollowStatusChange = (userId: number, followStatus: boolean) => {
    setTimeLinesBookshelf((prev) =>
      prev.map((timeLine) =>
        timeLine.user.id === userId ? { ...timeLine, follow_status: followStatus } : timeLine,
      ),
    )
  }

  // 本棚に登録したら現在のページのタイムラインを取り直す
  const refreshTimeLine = async () => {
    try {
      const timeLines = await getTimeLine(currentPage)
      setTimeLinesBookshelf(timeLines.result)
      setTotalCount(timeLines.total_count)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'タイムラインの取得に失敗しました', 'error')
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE))
  // 1ページに収まるときはページ送りを出さない
  const showPagination = totalPages > 1

  const pagination = (
    <Pagination
      currentPage={currentPage}
      nextPage={() => goToPage(currentPage + 1)}
      prevPage={() => goToPage(Math.max(1, currentPage - 1))}
      lastPage={currentPage >= totalPages}
      totalPages={totalPages}
    />
  )

  if (isLoading) return <Spinner message="タイムラインを読み込み中..." />

  return (
    <div className="card card-border bg-base-100 shadow-sm">
      <div className="card-body">
        {/* タイトルを左、ページ送りを中央に置くため左右を同じ幅(1fr)にする */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex items-center gap-2">
            <h3 className="card-title text-lg">タイムライン</h3>
            <span className="badge badge-primary badge-soft">{totalCount}件</span>
          </div>
          {showPagination && pagination}
        </div>

        {timeLinesBookshelf.length === 0 ? (
          <EmptyState
            title="まだタイムラインに投稿がありません"
            description="本棚に本が登録されるとここに表示されます"
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {timeLinesBookshelf.map((timeLine) => (
              <TimeLineBookshelf
                key={timeLine.bookshelf.id}
                timeLine={timeLine}
                onFollowStatusChange={handleFollowStatusChange}
                genreList={genreList}
                onRegistered={refreshTimeLine}
              />
            ))}
          </ul>
        )}

        {showPagination && (
          <div className="flex justify-center border-t border-base-300 pt-4">{pagination}</div>
        )}
      </div>
    </div>
  )
}

export default TimeLine
