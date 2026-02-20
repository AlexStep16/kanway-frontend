import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import ChatMessageModel from '@/models/ChatMessageModel'
import { ConfirmationData } from '@interfaces/ConfirmationData'
import { IUndoResponse } from '@/interfaces/IUndoResponse'
import { IActionResponse } from '@/interfaces/IActionResponse'

export type AgentProgress =
  | {
      role:
        | CustomEventsEnum.TOOLS_RETRIEVING
        | CustomEventsEnum.SYNTHESIZE_START
        | CustomEventsEnum.CALLING_TOOLS
        | CustomEventsEnum.HISTORY_RETRIEVING
    }
  | {
      role: CustomEventsEnum.PREVIEW
      content: ConfirmationData[]
    }
  | {
      role: CustomEventsEnum.UNDO
      undo: IUndoResponse
    }
  | {
      role: CustomEventsEnum.ACTIONS
      actions: IActionResponse
    }
  | {
      role: CustomEventsEnum.NEW_MESSAGE
      message: ChatMessageModel
    }
  | {
      role: CustomEventsEnum.UPDATE_MESSAGE
      message: ChatMessageModel
    }
