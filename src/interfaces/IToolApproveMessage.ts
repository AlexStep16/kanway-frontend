export interface IToolApproveMessage {
  id: string
  content: Array<{
    callId: string
    title: string
    args: {
      changes: any
    }
    entityType?: 'task' | 'category' | 'board' | 'workspace'
    context?: any[]
    isConfirmed?: boolean
    isCancelled?: boolean
  }>
}
