import { ITask } from '@/interfaces/domain/ITask'

export interface ITaskState extends ITask {
  tempId?: string
}
