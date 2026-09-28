export type SearchType = 'title' | 'author' | 'isbn'

export type SearchBookData = {
  keyword: string
  type: SearchType
}

// 外部APIから取得する内容
export type ApiBook = {
  isbn: string
  title: string
  author: string
  publisher: string
  sales_date: string
  size: string
  image_url: string
  item_url: string
  review_count: number
  review_average: string
}

// 本棚に表示する内容
export type DisplayBook = {
  id: number
  isbn: string
  title: string
  author: string
  item_url: string
  large_image_url: string
}
