import { useNotification } from '../hooks/use-notification'
import { type NotificationType } from '../../types/notification'

const alertColor: Record<NotificationType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning',
}

export default function NotificationBar() {
  const { notifications, dismiss } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="toast toast-top toast-end z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          role="alert"
          className={`alert ${alertColor[n.type]} toast-slide-in-right py-2 px-3 min-h-0 text-sm`}
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
