import type { IHmsNotification } from '@/types/notification.type'
import { readonly, ref } from 'vue'

const notifications = ref<IHmsNotification[]>([])
const notificationTimeouts = new Map<string, number>()

export const useHmsNotification = () => {
  const addNotification = (notification: Omit<IHmsNotification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      ...notification,
      duration: notification.duration ?? 3000,
    }

    notifications.value.push(newNotification)

    if (newNotification.duration > 0) {
      const timeoutId = window.setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)

      notificationTimeouts.set(id, timeoutId)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)

      if (notificationTimeouts.has(id)) {
        window.clearTimeout(notificationTimeouts.get(id))
        notificationTimeouts.delete(id)
      }
    }
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
  }
}
