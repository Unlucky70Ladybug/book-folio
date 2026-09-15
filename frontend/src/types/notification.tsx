export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export type Notification = {
  id: number
  message: string
  type: NotificationType
}
