import type { ModelsEnum } from '~/enums/ModelsEnum'

export interface IBaseAgentPayload {
  chatId: string
  jobId: string
  boardId?: string
  workspaceId: string
  modelType: ModelsEnum
  timezone: string
}
