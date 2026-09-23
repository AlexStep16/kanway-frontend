import type { IBaseAgentPayload } from './IBaseAgentPayload'

export interface RetryAgentPayload extends IBaseAgentPayload {
  threadId: string
}
