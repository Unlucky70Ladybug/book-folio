import { type User } from '../../../types/user'
import { type RelationshipStats } from '../../../types/relationship'
import { type Bookshelf, type ReadingStatus, READING_STATUS_LABELS } from '../../../types/bookshelf'
import defaultUserImage from '../../../assets/default_user_image.png'

type UserInfoProps = {
  user: User | null
  relationshipStats: RelationshipStats | null
  bookshelves: Bookshelf[]
}

// 本棚ページ上部のユーザー情報(アイコン・名前・フォロー数・読書状況)
export const UserInfo = ({ user, relationshipStats, bookshelves }: UserInfoProps) => {
  const countByStatus = (status: ReadingStatus) =>
    bookshelves.filter((bookshelf) => bookshelf.reading_status === status).length

  return (
    <div className="card rounded-b-none border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body flex-col gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-20 rounded-full ring-4 ring-secondary/40 ring-offset-2 ring-offset-base-100">
              <img src={user?.avatarImage ?? defaultUserImage} alt="ユーザーアイコン" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold">{user?.name}の本棚</p>
            <p className="text-sm text-base-content/60">{user?.name}さん</p>
            <p className="text-sm text-base-content/60 flex gap-4">
              <span>フォロー：{relationshipStats?.following.length}人</span>
              <span>フォロワー：{relationshipStats?.followers.length}人</span>
            </p>
          </div>
        </div>

        <div className="stats stats-horizontal bg-base-200 md:ml-auto">
          <div className="stat place-items-center px-4 md:px-6">
            <div className="stat-title">登録数</div>
            <div className="stat-value text-primary">{bookshelves.length}</div>
          </div>
          <div className="stat place-items-center px-4 md:px-6">
            <div className="stat-title">{READING_STATUS_LABELS.finished}</div>
            <div className="stat-value text-2xl">{countByStatus('finished')}</div>
          </div>
          <div className="stat place-items-center px-4 md:px-6">
            <div className="stat-title">{READING_STATUS_LABELS.reading}</div>
            <div className="stat-value text-2xl">{countByStatus('reading')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
