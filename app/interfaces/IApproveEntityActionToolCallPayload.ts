import { ModelsEnum } from '~/enums/ModelsEnum'
import type { IBaseAgentPayload } from '~/interfaces/IBaseAgentPayload'

export interface IApproveEntityActionToolCallPayload extends IBaseAgentPayload {
  id: string
  selectedIds: string[]
  modelType: ModelsEnum
  jobId: string
  isConfirmed: boolean
  threadId: string
}
