import { type Dispatch, type SetStateAction } from 'react'
import { type Bookshelf } from '../../../types/bookshelf'

// 更新成功後、該当の1冊だけ差し替えるハンドラを作る
export const handleUpdated =
  (setBookshelves: Dispatch<SetStateAction<Bookshelf[]>>) => (updated_book: Bookshelf) => {
    setBookshelves((prev) => prev.map((b) => (b.id === updated_book.id ? updated_book : b)))
  }
