import { OperationLogs } from "./OperationLogs"

export interface ModificationResult {
  result: {
    modifiedCount?: number,
    deletedCount?: number,
    createdCount?: number
  },
  operation_logs: OperationLogs
}