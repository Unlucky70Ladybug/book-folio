import { useRef, useEffect, useState } from 'react'
import { explanationStorage } from '../_utils/explanation-storage'

const Explanation = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(explanationStorage.shouldShow)

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal()
  }, [isOpen])

  const handleClose = () => {
    explanationStorage.dismiss()
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <dialog ref={dialogRef} className="modal" onClose={handleClose}>
      <div className="modal-box">
        <h1>Hello No BOOK</h1>
      </div>

      {/* 背景クリックで閉じる(onCloseが呼ばれる) */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default Explanation
