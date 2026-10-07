import { useId } from 'react'
import { type CreatePostParams } from '../../../../types/post'

type PostFieldProps = {
  value: CreatePostParams
  onChange: (value: CreatePostParams) => void
}

const SPOILER_OPTIONS: { value: boolean; label: string; color: string }[] = [
  { value: true, label: 'ネタバレあり', color: 'radio-warning' },
  { value: false, label: 'ネタバレなし', color: 'radio-success' },
]

// コメント(任意)と、そのネタバレ有無を入力する
export const PostField = ({ value, onChange }: PostFieldProps) => {
  const { content, has_spoiler } = value
  const name = `${useId()}-has-spoiler`
  // コメントを書いたときだけネタバレ有無が必須になる
  const isSpoilerRequired = content.trim() !== ''

  // 選択中のボタンをもう一度押すと未選択に戻す
  const toggle = (optionValue: boolean) => {
    onChange({ ...value, has_spoiler: has_spoiler === optionValue ? null : optionValue })
  }

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend flex-wrap">
        コメント
        <span className="badge badge-xs badge-ghost rounded-sm">任意</span>
        {SPOILER_OPTIONS.map(({ value: optionValue, label, color }) => (
          <label key={label} className="label cursor-pointer gap-1 text-xs font-normal">
            <input
              type="radio"
              name={name}
              // remが18pxのため、radio-xsだと端数が出て中心の円がずれる。pxで固定する
              className={`radio size-[16px] p-[3px] ${color}`}
              checked={has_spoiler === optionValue}
              readOnly
              onClick={() => toggle(optionValue)}
              required={isSpoilerRequired}
            />
            {label}
          </label>
        ))}
      </legend>
      <textarea
        className="textarea textarea-primary h-24 w-full"
        placeholder="感想やメモを書けます"
        value={content}
        onChange={(e) => onChange({ ...value, content: e.target.value })}
      />

      {isSpoilerRequired && has_spoiler === null ? (
        <p className="label text-xs text-error">
          コメントを書いた場合はネタバレの有無を選択してください
        </p>
      ) : !isSpoilerRequired && has_spoiler !== null ? (
        <p className="label text-xs text-error">
          コメントを書くか、ネタバレの選択をもう一度押して解除してください
        </p>
      ) : (
        <p className="label text-xs">
          コメントにネタバレを含むかを選択してください(もう一度押すと解除できます)
        </p>
      )}
    </fieldset>
  )
}
