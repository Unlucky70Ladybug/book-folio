import { useId } from 'react'
import { optionClass } from './options'

type PostFieldProps = {
  content: string
  // 未選択(null)から始まる
  hasSpoiler: boolean | null
  onContentChange: (content: string) => void
  onHasSpoilerChange: (hasSpoiler: boolean) => void
}

const SPOILER_OPTIONS: { value: boolean; label: string; color: string }[] = [
  { value: true, label: 'ネタバレあり', color: 'btn-warning' },
  { value: false, label: 'ネタバレなし', color: 'btn-success' },
]

// コメント(任意)と、そのネタバレ有無を入力する
export const PostField = ({
  content,
  hasSpoiler,
  onContentChange,
  onHasSpoilerChange,
}: PostFieldProps) => {
  const name = `${useId()}-has-spoiler`
  // コメントを書いたときだけネタバレ有無が必須になる
  const isSpoilerRequired = content.trim() !== ''

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        コメント
        <span className="badge badge-xs badge-ghost rounded-sm">任意</span>
      </legend>
      <textarea
        className="textarea h-24 w-full"
        placeholder="感想やメモを書けます"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {SPOILER_OPTIONS.map(({ value, label, color }) => (
          <input
            key={label}
            type="radio"
            name={name}
            aria-label={label}
            className={optionClass(color, hasSpoiler === value)}
            checked={hasSpoiler === value}
            onChange={() => onHasSpoilerChange(value)}
            required={isSpoilerRequired}
          />
        ))}
      </div>
      {isSpoilerRequired && hasSpoiler === null ? (
        <p className="label text-xs text-error">
          コメントを書いた場合はネタバレの有無を選択してください
        </p>
      ) : (
        <p className="label text-xs">コメントにネタバレを含むかを選択してください</p>
      )}
    </fieldset>
  )
}
