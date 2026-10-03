import { useState } from 'react'
import { type Genre } from '../../../../types/genre'
import { CloseIcon, PlusIcon } from './ui/icons'

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
          // 角丸を抑え、高さを文字に合わせて文字がふちからはみ出さないようにする
          <span
            key={genre.id}
            className="badge badge-lg badge-secondary badge-soft h-auto gap-1.5 rounded-md py-1 pr-1.5 pl-3 whitespace-nowrap"
          >
            {genre.name}
            <button
              type="button"
              aria-label={`${genre.name}を解除`}
              className="btn btn-circle btn-ghost btn-xs size-5"
              onClick={() => remove(genre.id)}
            >
              <CloseIcon className="size-3" />
            </button>
          </span>
        ))}
        <div className="tooltip" data-tip={isMenuOpen ? '閉じる' : 'ジャンルを追加'}>
          <button
            type="button"
            aria-label={isMenuOpen ? 'ジャンル一覧を閉じる' : 'ジャンルを追加'}
            aria-expanded={isMenuOpen}
            className="btn btn-circle btn-sm btn-secondary"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {/* 開閉に合わせて＋と×を回転しながら切り替える */}
            <span className={`swap swap-rotate ${isMenuOpen ? 'swap-active' : ''}`}>
              <CloseIcon className="swap-on size-4" />
              <PlusIcon className="swap-off size-4" />
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
                  className={`badge badge-lg badge-outline badge-secondary h-auto cursor-pointer gap-1 rounded-md bg-base-100 py-1 whitespace-nowrap transition-[scale,opacity,background-color,color] duration-200 hover:bg-secondary hover:text-secondary-content ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-80 opacity-0'}`}
                  // 順番に飛び出して見えるよう少しずつ遅らせる
                  style={{ transitionDelay: isMenuOpen ? `${Math.min(i, 10) * 20}ms` : '0ms' }}
                  onClick={() => add(genre.id)}
                >
                  <PlusIcon className="size-3" />
                  {genre.name}
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
