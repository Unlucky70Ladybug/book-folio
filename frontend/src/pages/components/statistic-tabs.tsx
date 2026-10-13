import { NavLink } from 'react-router-dom'

const STATISTIC_TABS = [
  { to: '/genre-statistic', label: 'ジャンル別' },
  { to: '/author-statistic', label: '著作者別' },
]

// ジャンル統計と著作者統計を切り替えるタブ。md以上では縦並びにして円グラフの左横に置く
export const StatisticTabs = () => (
  <div
    role="tablist"
    className="tabs tabs-box shrink-0 self-center md:flex-col md:items-stretch md:self-start"
  >
    {STATISTIC_TABS.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        role="tab"
        className={({ isActive }) => `tab ${isActive ? 'tab-active' : ''}`}
      >
        {label}
      </NavLink>
    ))}
  </div>
)
