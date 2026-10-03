import { useState } from 'react'
import { type Genre } from '../../../../types/genre'

type GenreFieldProps = {
  genreList: Genre[]
  value: number[]
  onChange: (genreIds: number[]) => void
}

// ジャンル(必須・複数)を選ぶ。選択中はバッジ、追加はSpeed Dial風のメニューから行う
export const GenreField = ({ genreList, value, onChange }: GenreFieldProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 一覧の並び順で表示するため、genreList から絞り込む
  const selectedGenres = genreList.filter((genre) => value.includes(genre.id))
  // メニューには未選択のジャンルだけを出す
  const addableGenres = genreList.filter((genre) => !value.includes(genre.id))

  const add = (genreId: number) => onChange([...value, genreId])
  const remove = (genreId: number) => onChange(value.filter((id) => id !== genreId))

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        ジャンル
        <span className="badge badge-xs badge-primary badge-soft rounded-sm">必須</span>
      </legend>

      {/* 選択中のジャンル(×で解除) + 追加ボタン */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedGenres.map((genre) => (
          <span key={genre.id} className="badge badge-secondary gap-1">
            {genre.name}
            <button
              type="button"
              aria-label={`${genre.name}を解除`}
              className="cursor-pointer opacity-70 hover:opacity-100"
              onClick={() => remove(genre.id)}
            >
              ✕
            </button>
          </span>
        ))}
        <div className="tooltip" data-tip={isMenuOpen ? '閉じる' : 'ジャンルを追加'}>
          <button
            type="button"
            aria-label="ジャンルを追加"
            aria-expanded={isMenuOpen}
            className="btn btn-circle btn-sm btn-secondary"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {/* 開いている間は＋を45度回して×に見せる */}
            <span
              className={`text-lg leading-none transition-transform duration-200 ${isMenuOpen ? 'rotate-45' : ''}`}
            >
              +
            </span>
          </button>
        </div>
      </div>

      {/* 追加できるジャンル一覧(FABのように開閉する) */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 flex flex-wrap gap-2 rounded-box bg-base-200 p-3">
            {addableGenres.length === 0 ? (
              <span className="text-xs text-base-content/60">すべてのジャンルを追加済みです</span>
            ) : (
              addableGenres.map((genre, i) => (
                <button
                  key={genre.id}
                  type="button"
                  tabIndex={isMenuOpen ? 0 : -1}
                  className={`btn btn-xs btn-secondary btn-outline rounded-full bg-base-100 transition-[scale,opacity] duration-200 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-80 opacity-0'}`}
                  // 順番に飛び出して見えるよう少しずつ遅らせる
                  style={{ transitionDelay: isMenuOpen ? `${Math.min(i, 10) * 20}ms` : '0ms' }}
                  onClick={() => add(genre.id)}
                >
                  + {genre.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {value.length === 0 ? (
        <p className="label text-xs text-error">＋ボタンからジャンルを1つ以上追加してください</p>
      ) : (
        <p className="label text-xs">✕で解除、＋から追加できます</p>
      )}
    </fieldset>
  )
}
