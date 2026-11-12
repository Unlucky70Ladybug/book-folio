import { useContext, useRef, useState } from 'react'
import { type User } from '../../../types/user'
import { type RelationshipStats } from '../../../types/relationship'
import { type Bookshelf, type ReadingStatus, READING_STATUS_LABELS } from '../../../types/bookshelf'
import defaultUserImage from '../../../assets/default_user_image.png'
import Relationship from '../../relationship/_components/relationship-modal'
import UnFollowButton from '../../relationship/_components/unfollow'
import FollowButton from '../../relationship/_components/follow'
import { postFollow } from '../../relationship/_hooks/post-follow'
import { deleteFollow } from '../../relationship/_hooks/delete-follow'
import { NotificationContext } from '../../providers/notification-provider'

type UserInfoProps = {
  user: User | null
  relationshipStats: RelationshipStats | null
  bookshelves: Bookshelf[]
  onRelationshipChange?: (stats: RelationshipStats) => void
}

// 本棚ページ上部のユーザー情報(アイコン・名前・フォロー数・読書状況)
export default function UserInfo({ user, relationshipStats, bookshelves, onRelationshipChange }: UserInfoProps){
  const countByStatus = (status: ReadingStatus) =>
    bookshelves.filter((bookshelf) => bookshelf.reading_status === status).length
  const followingRef = useRef<HTMLDialogElement>(null)
  const followersRef = useRef<HTMLDialogElement>(null)
  const { notify } = useContext(NotificationContext)
  const [isRelationshipLoading, setIsRelationshipLoading] = useState<boolean>(false)

  // フォロー・フォロー解除の共通処理。成功後に最新のフォロー状態・人数を取り直して親に渡す
  const handleFollowToggle = async (action: (id: number) => Promise<RelationshipStats>, message: string) => {
    if (!user?.id) return
    setIsRelationshipLoading(true)
    try {
      const stats = await action(user.id)
      onRelationshipChange?.(stats)
      notify(message, 'success')
    } catch {
      notify('操作に失敗しました', 'error')
    } finally {
      setIsRelationshipLoading(false)
    }
  }

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
              <button type="button" className="link-hover" onClick={() => followingRef.current?.showModal()}>
                フォロー：{relationshipStats?.following.length}人
              </button>
              <button type="button" className="link-hover" onClick={() => followersRef.current?.showModal()}>
                フォロワー：{relationshipStats?.followers.length}人
              </button>
            </p>
            <Relationship title="フォロー" users={relationshipStats?.following ?? []} dialogRef={followingRef} />
            <Relationship title="フォロワー" users={relationshipStats?.followers ?? []} dialogRef={followersRef} />
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
        {relationshipStats?.follow_status === false && (
          <FollowButton
            onClick={() => handleFollowToggle(postFollow, 'フォローしました')}
            isLoading={isRelationshipLoading}
          />
        )}
        {relationshipStats?.follow_status === true && (
          <UnFollowButton
            onClick={() => handleFollowToggle(deleteFollow, 'フォローを解除しました')}
            isLoading={isRelationshipLoading}
          />
        )}
      </div>
    </div>
  )
}
