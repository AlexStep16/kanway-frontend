import { ModelsEnum } from '~/enums/ModelsEnum'

export interface ResolveAmbiguous {
  callId: string
  ids: string[]
  chatId: string
  jobId: string
  modelType: ModelsEnum
  chatMessageId: string
  boardId: string
  workspaceId: string
  timezone: string
}
