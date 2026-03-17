import { IBaseAgentPayload } from './IBaseAgentPayload'

export interface IApproveEntityActionToolCallPayload extends IBaseAgentPayload {
  id: string
  selectedIds: string[]
  isConfirmed: boolean
  threadId: string
}
