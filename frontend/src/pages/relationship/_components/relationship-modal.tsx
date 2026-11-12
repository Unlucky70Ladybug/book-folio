import { type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { type User } from '../../../types/user'
import defaultUserImage from '../../../assets/default_user_image.png'

type RelationshipProps = {
  title: string
  users: User[]
  dialogRef: RefObject<HTMLDialogElement | null>
}

// フォロー・フォロワーのユーザー一覧モーダル
export default function Relationship({ title, users, dialogRef }: RelationshipProps) {
  const close = () => dialogRef.current?.close()

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex max-h-[80vh] w-11/12 max-w-md flex-col">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="閉じる"
          >
            ✕
          </button>
        </form>

        <h3 className="text-lg font-bold">
          {title}：
          <span className="ml-2 text-sm font-normal text-base-content/60">{users.length}人</span>
        </h3>

        <div className="mt-4 flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/60">ユーザーがいません</p>
          ) : (
            <ul className="list">
              {users.map((user) => (
                <li key={user.id}>
                  <Link
                    to={`/bookshelf/${user.id}`}
                    onClick={close}
                    className="list-row items-center rounded-box hover:bg-base-200"
                  >
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={user.avatarImage ?? defaultUserImage}
                          alt={`${user.name}のアイコン`}
                        />
                      </div>
                    </div>
                    <p className="font-medium">{user.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 背景クリックで閉じる */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
