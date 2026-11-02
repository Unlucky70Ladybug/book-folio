import { useNotification } from '../hooks/use-notification'
import { type NotificationType } from '../../types/notification'

const alertColor: Record<NotificationType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning',
}

// スナックバーの表示位置(画面上端からの距離)。値を変えて高さを微調整する
const TOAST_TOP_OFFSET = '30vh'

export default function NotificationBar() {
  const { notifications, dismiss } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="toast toast-top toast-end z-50" style={{ top: TOAST_TOP_OFFSET }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          role="alert"
          className={`alert alert-outline ${alertColor[n.type]} toast-slide-in-right bg-white border-2 text-black py-2 px-3 min-h-0 text-sm`}
        >
          <span>{n.message}</span>
          <button
            type="button"
            className="btn btn-circle btn-ghost btn-xs"
            onClick={() => dismiss(n.id)}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
