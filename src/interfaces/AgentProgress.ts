import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import ChatMessageModel from '@/models/ChatMessageModel'
import { IOperationLog } from './domain/IOperationLog'
import { IResponseWithLog } from './IResponseWithLog'

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
