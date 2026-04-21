import { ModelsEnum } from '@/enums/ModelsEnum'

export interface RetryAgentPayload {
  chatId: string
  threadId: string
  modelType: ModelsEnum
  jobId: string
  boardId: string
  workspaceId: string
  timezone: string
}
