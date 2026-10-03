import {
  READING_STATUS_LABELS,
  type PreferenceRating,
  type ReadingStatus,
} from '../../../../types/bookshelf'

// 選択肢ごとの色(Tailwindが検出できるようクラス名はリテラルで持つ)
export const READING_STATUS_COLORS: Record<ReadingStatus, string> = {
  interested: 'btn-info',
  reading: 'btn-primary',
  finished: 'btn-success',
}

// ReadingStatus型の配列を作成 値：['interested', 'reading', 'finished']
export const READING_STATUSES = Object.keys(READING_STATUS_LABELS) as ReadingStatus[]

// unrated は「未選択」扱いのため選択肢には出さない
export type SelectableRating = Exclude<PreferenceRating, 'unrated'>

// テーマに灰色・ピンクが無いため、daisyUIのボタン色変数を直接上書きする
export const PREFERENCE_RATING_OPTIONS: { value: SelectableRating; color: string }[] = [
  { value: 'not_for_me', color: '[--btn-color:var(--color-gray-400)] [--btn-fg:white]' },
  { value: 'normal', color: 'btn-success' },
  { value: 'interesting', color: 'btn-warning' },
  { value: 'favorite', color: '[--btn-color:var(--color-pink-400)] [--btn-fg:white]' },
]

// 未選択は淡い色、選択中は塗りつぶし
export const optionClass = (color: string, selected: boolean) =>
  `btn btn-sm ${color} ${selected ? '' : 'btn-soft'}`
