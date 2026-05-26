import type { AgentsEnum } from '~/enums/AgentsEnum'
import type { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { StatusLog } from '~/types/StatusLog'

export interface IStatus {
  statusText: string
  currentAgent: AgentsEnum
  state: StatusStatesEnum
  logs: StatusLog[]
}
