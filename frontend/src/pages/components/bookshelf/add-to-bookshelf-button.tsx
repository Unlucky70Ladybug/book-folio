import { useRef } from 'react'
import { type ApiBook } from '../../../types/book'
import { type Genre } from '../../../types/genre'
import AddToBookshelfModal from './add-to-bookshelf-modal'

type AddToBookshelfButtonProps = {
  book: ApiBook
  genreList: Genre[]
}

// 「本棚に登録」ボタン(押すと登録モーダルを開く)
export default function AddToBookshelfButton({ book, genreList }: AddToBookshelfButtonProps) {
  // DOM要素を参照する
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-soft btn-primary w-full"
        onClick={() => dialogRef.current?.showModal()}
      >
        本棚に登録
      </button>
      <AddToBookshelfModal book={book} dialogRef={dialogRef} genreList={genreList} />
    </>
  )
}
