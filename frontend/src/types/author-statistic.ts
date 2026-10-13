import { type DisplayBook } from './book'

export type AuthorStatistics = {
  author: string
  books: DisplayBook[]
  books_count: number
  ratio: number
}
