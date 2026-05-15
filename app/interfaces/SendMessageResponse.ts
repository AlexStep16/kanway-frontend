import type { IChat } from '~/interfaces/domain/IChat'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'

export interface SendMessageResponse {
  jobId: string
  userMessage: IChatMessage
  stepMessage: IChatMessage
  chat: IChat
  threadId: string
}
