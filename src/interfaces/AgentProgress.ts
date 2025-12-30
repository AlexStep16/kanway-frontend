import { AgentRolesEnum } from '@/enums/AgentRolesEnum'
import ChatMessageModel from '@/models/ChatMessageModel'
import { ConfirmationData } from '@interfaces/ConfirmationData'
import { IUndoResponse } from '@interfaces/IUndoResponse'

export type AgentProgress =
  | {
      role:
        | AgentRolesEnum.TOOLS_RETRIEVING
        | AgentRolesEnum.SYNTHESIZE_START
        | AgentRolesEnum.CALLING_TOOLS
        | AgentRolesEnum.HISTORY_RETRIEVING
    }
  | {
      role: AgentRolesEnum.ASSISTANT_CHUNK | AgentRolesEnum.ASSISTANT_FINAL
      content: string
    }
  | {
      role: AgentRolesEnum.PREVIEW
      content: ConfirmationData[]
    }
  | {
      role: AgentRolesEnum.INTEGRATION
      integration: IUndoResponse<any>
    }
  | {
      role: AgentRolesEnum.TOOLS_EXECUTION
      name: string
      toolCallId: string
      input: string
      title: string
    }
  | {
      role: AgentRolesEnum.NEW_MESSAGE
      message: ChatMessageModel
    }
  | {
      role: AgentRolesEnum.LIST_ENTITIES
      content: {
        entities: any[]
        type: string
      }
    }
