import type { IBaseAgentPayload } from './IBaseAgentPayload'

export interface IApproveToolPayload extends IBaseAgentPayload {
  toolId: string
  statusLogId: string
  isConfirmed: boolean
  isRejected: boolean
  threadId: string
}
