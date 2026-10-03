import { useId } from 'react'
import { PREFERENCE_RATING_LABELS, type PreferenceRating } from '../../../../types/bookshelf'
import { PREFERENCE_RATING_OPTIONS, optionClass, type SelectableRating } from './options'

type PreferenceRatingFieldProps = {
  value: PreferenceRating
  onChange: (rating: PreferenceRating) => void
}

// 好み評価(任意)を選ぶラジオボタン
export const PreferenceRatingField = ({ value, onChange }: PreferenceRatingFieldProps) => {
  const name = `${useId()}-preference-rating`

  // 選択中の評価をもう一度押すと未評価に戻す
  const toggle = (rating: SelectableRating) => {
    onChange(value === rating ? 'unrated' : rating)
  }

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        好み評価
        <span className="badge badge-xs badge-ghost rounded-sm">任意</span>
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PREFERENCE_RATING_OPTIONS.map(({ value: rating, color }) => (
          <input
            key={rating}
            type="radio"
            name={name}
            aria-label={PREFERENCE_RATING_LABELS[rating]}
            className={optionClass(color, value === rating)}
            checked={value === rating}
            readOnly
            onClick={() => toggle(rating)}
          />
        ))}
      </div>
      <p className="label text-xs">もう一度押すと選択を解除できます</p>
    </fieldset>
  )
}
