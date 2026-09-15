import { useContext } from 'react'
import { NotificationContext } from '../providers/notification-provider'

export const useNotification = () => useContext(NotificationContext)
