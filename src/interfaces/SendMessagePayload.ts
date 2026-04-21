import { ModelsEnum } from '@/enums/ModelsEnum'

export interface SendMessagePayload {
  message: string
  modelType: ModelsEnum
  workspaceId: string
  timezone: string
  jobId: string
  boardId?: string
  threadId?: string
}
