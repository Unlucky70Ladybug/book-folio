import { useEffect, useState } from 'react'
import { type Genre } from '../../../types/genre'
import { useNotification } from '../../hooks/use-notification'
import { getGenres } from './get-genres'

// ジャンル一覧を初回だけ取得して返す(取得できるまでは空配列)
export const useGenres = (): Genre[] => {
  const { notify } = useNotification()
  const [genreList, setGenreList] = useState<Genre[]>([])

  useEffect(() => {
    let ignore = false

    getGenres()
      .then((result) => {
        if (!ignore) setGenreList(result)
      })
      .catch((err) => {
        if (!ignore)
          notify(err instanceof Error ? err.message : 'ジャンルの取得に失敗しました', 'error')
      })

    return () => {
      ignore = true
    }
  }, [notify])

  return genreList
}
