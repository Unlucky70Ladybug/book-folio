import { type BookshelfForPreference } from './bookshelf'

export type PreferenceRating = 'unrated' | 'not_for_me' | 'normal' | 'interesting' | 'favorite'

type PreferenceCounts = Record<PreferenceRating, number>

export type Preference = {
  total: number
  counts: PreferenceCounts
  ratios: PreferenceCounts
}

export type BookshelfPreference = {
  books: BookshelfForPreference[]
  preference: Preference
}

// 評価ごとの集計(円グラフと評価別の本棚で使う)
export type RatingSummary = {
  rating: PreferenceRating
  count: number
  // 登録した本全体に対する割合(%)
  ratio: number
  books: BookshelfForPreference[]
}

// 評価ごとのグラフの色(テーマのオレンジに合わせ、評価が高いほど濃い暖色にする)
export const RATING_COLORS: Record<PreferenceRating, string> = {
  favorite: 'oklch(58% 0.19 30)',
  interesting: 'oklch(74% 0.16 60)',
  normal: 'oklch(86% 0.09 85)',
  not_for_me: 'oklch(45% 0.03 55)',
  // 未評価は評価済みと区別できるよう、彩度のないグレーにする
  unrated: 'oklch(80% 0 0)',
}
