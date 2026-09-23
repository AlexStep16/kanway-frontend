import { OperationLogStatusesEnum } from '~/enums/OperationLogStatusesEnum'
import { OperationTypesEnum } from '~/enums/OperationTypesEnum'

export interface IOperationLog {
  id: string
  operationType: OperationTypesEnum
  collectionName: string
  entitiesBefore?: any[]
  entitiesAfter?: any[]
  status: OperationLogStatusesEnum
  isUndone: boolean
  userId: string
  dependencies: string[]
  createdAt: Date
  updatedAt: Date
}
