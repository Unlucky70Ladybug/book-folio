export type SearchType = 'title' | 'author' | 'isbn'

export type SearchBookData = {
  keyword: string
  type: SearchType
}
export type Book = {
  isbn: string
  title: string
  author: string
  publisher: string
  sales_date: string
  image_url: string
  item_url: string
}
