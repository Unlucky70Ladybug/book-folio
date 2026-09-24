export type SearchType = 'title' | 'author' | 'isbn'

export type SearchBookData = {
  keyword: string
  type: SearchType
}