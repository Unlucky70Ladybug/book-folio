import { type User } from './user'
import { type DisplayBook } from './book'
import { type Genre } from './genre'
import { type Post } from './post'

export type Bookshelf = {
  id: number
  reading_status: ReadingStatus
  preference_rating: PreferenceRating
  book: DisplayBook
  genres: Genre[]
  // コメント未登録のときはnull
  post: Post | null
}

export type BookshelfForPreference = {
  id: number
  reading_status: ReadingStatus
  preference_rating: PreferenceRating
  book: DisplayBook
}

export type OtherUserBookshelves = {
  user: User
  bookshelves: Bookshelf[]
}

export type BookshelfPost = {
  id: number
  reading_status: ReadingStatus
  preference_rating: PreferenceRating
  genres: Genre[]
  // コメント未登録のときはnull
  post: Post | null
}

export type ReadingStatus = 'interested' | 'reading' | 'finished'

export type PreferenceRating = 'unrated' | 'not_for_me' | 'normal' | 'interesting' | 'favorite'

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  interested: '気になる本',
  reading: '読書中',
  finished: '読み終わった',
}

export const PREFERENCE_RATING_LABELS: Record<PreferenceRating, string> = {
  unrated: '未定義',
  not_for_me: '合わなかった',
  normal: '普通',
  interesting: '面白い',
  favorite: 'お気に入り',
}

// 好み順の並べ替えタブ
export const PREFERENCE_SORT_TABS = [
  { key: 'registered', label: '登録順' },
  { key: 'preference', label: '好み順' },
] as const

export type PreferenceSortKey = (typeof PREFERENCE_SORT_TABS)[number]['key']

// 読書状況順の並べ替えタブ
export const READING_SORT_TABS = [
  { key: 'all', label: 'すべて' },
  { key: 'finished', label: '読み終わった' },
  { key: 'reading', label: '読書中' },
  { key: 'interested', label: '気になる' },
] as const

export type ReadingSortKey = (typeof READING_SORT_TABS)[number]['key']
