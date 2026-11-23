import { type Bookshelf } from './bookshelf'

export type AuthorStatistics = {
  author: string
  bookshelves: Bookshelf[]
  books_count: number
  ratio: number
}

export type AuthorSummary = AuthorStatistics & {
  color: string
}