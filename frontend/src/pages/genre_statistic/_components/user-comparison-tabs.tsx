import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type ComparisonUser, type SimilarUser } from '../../../types/user'
import defaultUserImage from '../../../assets/default_user_image.png'

const COMPARISON_TABS = [
  { key: 'similar_users', label: '似ている' },
  { key: 'middle_users', label: 'ほどほど' },
  { key: 'different_users', label: '似てない' },
] as const

// similar_users | middle_users | different_usersを取得
type ComparisonTabKey = (typeof COMPARISON_TABS)[number]['key']

type UserComparisonTabsProps = {
  users: SimilarUser
}

// 読書傾向が似ている/ほどほど/違うユーザーをタブで切り替えて表示する(ページ遷移はしない)
export const UserComparisonTabs = ({ users }: UserComparisonTabsProps) => {
  const [activeTab, setActiveTab] = useState<ComparisonTabKey>('similar_users')
  const activeUsers: ComparisonUser[] = users[activeTab] ?? []

  return (
    <div className="flex w-full flex-col gap-3 md:w-64 md:shrink-0">
      <p className="text-sm font-bold text-base-content/70">読書傾向が近いユーザー</p>
      <div role="tablist" className="tabs tabs-box tabs-sm">
        {COMPARISON_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            className={`tab flex-1 ${activeTab === key ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeUsers.length === 0 ? (
        <p className="py-4 text-center text-sm text-base-content/60">該当するユーザーがいません</p>
      ) : (
        <ul className="list rounded-box bg-base-100">
          {activeUsers.map(({ id, name, avatar_image }) => (
            <li key={id} className="list-row items-center py-2">
              <Link to={`/bookshelf/${id}`} className="avatar">
                <div className="w-8 rounded-full">
                  <img src={avatar_image?.url ?? defaultUserImage} alt={`${name}さんのアイコン`} />
                </div>
              </Link>
              <Link
                to={`/bookshelf/${id}`}
                className="link link-hover shrink-0 font-semibold"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
