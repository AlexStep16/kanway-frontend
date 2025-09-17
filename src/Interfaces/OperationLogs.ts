import { OperationLog } from "./OperationLog"

export interface OperationLogs {
  operationLog: OperationLog
  dependencies: OperationLog[]
}
