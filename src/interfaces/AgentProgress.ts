import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import ChatMessageModel from '@/models/ChatMessageModel'
import { IUndoResponse } from '@/interfaces/IUndoResponse'
import { IOperationLog } from './domain/IOperationLog'

export type AgentProgress =
  | {
      role: CustomEventsEnum.UNDO
      data: IUndoResponse
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
