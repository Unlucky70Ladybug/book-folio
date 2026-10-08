import { type BookshelfForPreference } from "./bookshelf";

type PreferenceRating =
  | 'unrated'
  | 'not_for_me'
  | 'normal'
  | 'interesting'
  | 'favorite'

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