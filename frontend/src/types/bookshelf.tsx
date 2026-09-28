import { type DisplayBook } from './book'

export type Bookshelf = {
  id: number
  reading_status: ReadingStatus
  preference_rating: PreferenceRating
  book: DisplayBook
}

export type ReadingStatus = 'unread' | 'finished' | 'reading' | 'interested'

export type PreferenceRating = 'unrated' | 'not_for_me' | 'normal' | 'interesting' | 'favorite'

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  unread: '未定義',
  finished: '読み終わった',
  reading: '読書中',
  interested: '気になる本',
}

export const PREFERENCE_RATING_LABELS: Record<PreferenceRating, string> = {
  unrated: '未定義',
  not_for_me: '合わなかった',
  normal: '普通',
  interesting: '面白い',
  favorite: 'お気に入り',
}
