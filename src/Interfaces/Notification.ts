import NotificationEntities from "../enums/NotificationEntitiesEnum"

interface Notification {
  _id?: string
  description: string
  action_type: string
  entity_type?: NotificationEntities
  hasCancel?: boolean
  time?: number
  refDivElement?: HTMLElement
}

interface NotificationStrict {
  _id: string
  description: string
  action_type: string
  entity_type?: NotificationEntities
  hasCancel?: boolean
  time: number
  refDivElement?: HTMLElement
}

export { Notification, NotificationStrict }