import { type DisplayBook } from './book'
import { type Genre } from './genre'

// ジャンルと、そのジャンルに登録した本
export type GenresBooks = Genre & {
  books: DisplayBook[]
}

// ジャンルごとの集計
export type GenreStatistics = Genre & {
  books_count: number
  ratio: number
}

// ジャンルごとの集計と本(円グラフとジャンル別の本棚で使う)
export type GenreSummary = GenreStatistics & {
  books: DisplayBook[]
  color: string
}

// ジャンルごとのグラフの色。ジャンル数は可変なので、隣り合う色が似ないよう色相を黄金角ずつずらす
export const genreColor = (index: number): string =>
  `oklch(70% 0.15 ${Math.round((30 + index * 137.5) % 360)})`

export type GenreStatisticsResponse = {
  genres_books: GenresBooks[]
  genre_statistics: GenreStatistics[]
}
