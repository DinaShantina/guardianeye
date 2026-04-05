export type AlertSeverity = 'urgent' | 'warning'
export type AlertCategory =
  | 'explicit_content'
  | 'stranger_contact'
  | 'self_harm'
  | 'meeting_language'
  | 'flagged_video'

export type MessageThread = {
  sender: string
  text: string
  timestamp: string
}

export type AlertEvent = {
  id: string
  severity: AlertSeverity
  category: AlertCategory
  senderName: string
  senderPhoto: string
  childReplied: boolean
  messagePreview: string
  sourceApp: string
  sourceDevice: 'android' | 'pc'
  timestamp: string
  isFirstContact: boolean
  thread: MessageThread[]
  read: boolean
}
