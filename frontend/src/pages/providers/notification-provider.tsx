import React, { createContext, useCallback, useRef, useState } from 'react'
import { type Notification, type NotificationType } from '../../types/notification'

type Props = {
  children: React.ReactNode
}

// 3秒で通知バーが消える
const DISPLAY_DURATION = 3000

// コンテキストで通知バーを作成
// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<{
  notifications: Notification[]
  notify: (message: string, type?: NotificationType) => void
  dismiss: (id: number) => void
}>({
  notifications: [],
  notify: () => {},
  dismiss: () => {},
})

export const NotificationProvider = ({ children }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const nextId = useRef(0)

  // 自動で通知バーを削除
  const dismiss = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, type: NotificationType = 'info') => {
      const id = nextId.current++
      setNotifications((prev) => [...prev, { id, message, type }])
      setTimeout(() => dismiss(id), DISPLAY_DURATION)
    },
    [dismiss],
  )

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  )
}
