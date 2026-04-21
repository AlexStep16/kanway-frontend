import { ModelsEnum } from '@/enums/ModelsEnum'
import { IBaseAgentPayload } from './IBaseAgentPayload'

export interface IApproveEntityActionToolCallPayload extends IBaseAgentPayload {
  id: string
  selectedIds: string[]
  modelType: ModelsEnum
  jobId: string
  isConfirmed: boolean
  threadId: string
}
