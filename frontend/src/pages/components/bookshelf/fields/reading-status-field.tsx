import { useId } from 'react'
import { READING_STATUS_LABELS, type ReadingStatus } from '../../../../types/bookshelf'
import { READING_STATUS_COLORS, READING_STATUSES, optionClass } from './options'

type ReadingStatusFieldProps = {
  // 新規登録では未選択(null)から始まる
  value: ReadingStatus | null
  onChange: (status: ReadingStatus) => void
}

// 読書状況(必須)を選ぶラジオボタン
export const ReadingStatusField = ({ value, onChange }: ReadingStatusFieldProps) => {
  // 同じページに複数のモーダルが並ぶため、ラジオのnameを一意にする
  const name = `${useId()}-reading-status`

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        読書状況
        <span className="badge badge-xs badge-primary badge-soft rounded-sm">必須</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {READING_STATUSES.map((status) => (
          <input
            key={status}
            type="radio"
            name={name}
            aria-label={READING_STATUS_LABELS[status]}
            className={optionClass(READING_STATUS_COLORS[status], value === status)}
            checked={value === status}
            onChange={() => onChange(status)}
            required
          />
        ))}
      </div>
    </fieldset>
  )
}
