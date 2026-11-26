import { useEffect, useState } from 'react'
import { getTimeLine } from '../_hooks/get-time-lines'
import { getGenres } from '../../bookshelf/_hooks/get-genres'
import { useNotification } from '../../hooks/use-notification'
import { type TimeLinesBookshelf } from '../../../types/bookshelf'
import { type Genre } from '../../../types/genre'
import { EmptyState } from '../../components/empty-state'
import Spinner from '../../components/layouts/ui/spinner'
import TimeLineBookshelf from '../_components/time-line-bookshelf'

// みんなの本棚への登録を新しい順に表示するページ
const TimeLine = () => {
  const { notify } = useNotification()
  const [timeLinesBookshelf, setTimeLinesBookshelf] = useState<TimeLinesBookshelf[]>([])
  const [genreList, setGenreList] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false

    Promise.all([getTimeLine(), getGenres()])
      .then(([timeLines, genresResult]) => {
        if (ignore) return 
        setTimeLinesBookshelf(timeLines)
        setGenreList(genresResult)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : 'タイムラインの取得に失敗しました', 'error')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [notify])

  // 同じユーザーの投稿すべてのフォロー状態をまとめて更新する
  const handleFollowStatusChange = (userId: number, followStatus: boolean) => {
    setTimeLinesBookshelf((prev) =>
      prev.map((timeLine) =>
        timeLine.bookshelf.user.id === userId
          ? { ...timeLine, follow_status: followStatus }
          : timeLine,
      ),
    )
  }

  if (isLoading) return <Spinner message="タイムラインを読み込み中..." />

  return (
    <div className="card card-border bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-2">
          <h3 className="card-title text-lg">タイムライン</h3>
          <span className="badge badge-primary badge-soft">{timeLinesBookshelf.length}件</span>
        </div>

        {timeLinesBookshelf.length === 0 ? (
          <EmptyState
            title="まだタイムラインに投稿がありません"
            description="本棚に本が登録されるとここに表示されます"
          />
        ) : (
          <ul className="list">
            {timeLinesBookshelf.map((timeLine) => (
              <TimeLineBookshelf
                key={timeLine.bookshelf.id}
                timeLine={timeLine}
                onFollowStatusChange={handleFollowStatusChange}
                genreList={genreList}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TimeLine
