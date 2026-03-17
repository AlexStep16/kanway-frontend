export interface IEntityActionConfirmationContent {
  id: string
  entityType: 'task' | 'category' | 'board' | 'workspace'
  action: 'create' | 'update' | 'delete'
  entities: any[]
  isConfirmed: boolean
  isResolved: boolean
  selectedEntityIds: string[]
}
