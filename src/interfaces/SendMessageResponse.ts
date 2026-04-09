import { IChat } from '@interfaces/domain/IChat'
import { IChatMessage } from '@interfaces/domain/IChatMessage'

export interface SendMessageResponse {
  jobId: string
  chat: IChat
  threadId: string
}
