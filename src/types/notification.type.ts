export enum HmsNotificationEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type HmsNotificationType = 'success' | 'error'

export interface IHmsNotification {
  id: string
  type: HmsNotificationType
  title: string
  message?: string
  duration?: number
}
