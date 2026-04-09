import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import ChatMessageModel from '@/models/ChatMessageModel'
import { IOperationLog } from './domain/IOperationLog'
import { IResponseWithLog } from './IResponseWithLog'
import { IChat } from './domain/IChat'
import { IChatMessage } from './domain/IChatMessage'

export type AgentProgress =
  | {
      role: CustomEventsEnum.UNDO
      data: IResponseWithLog<any>[]
    }
  | {
      role: CustomEventsEnum.OPERATION
      data: IOperationLog
    }
  | {
      role: CustomEventsEnum.NEW_MESSAGE
      data: ChatMessageModel
    }
  | {
      role: CustomEventsEnum.UPDATE_MESSAGE
      data: ChatMessageModel
    }
  | {
      role: CustomEventsEnum.CHAT_UPDATED
      data: IChat
    }
