import { StatusTypesEnum } from '@/enums/StatusTypesEnum.js'
import type { IStatusLogBase } from '~/interfaces/Statuses/IStatusLogBase'
import type { StatusTools } from './StatusTools'

export type StatusLog =
  | IStatusLogBase<StatusTypesEnum.REASONING, { reasoning: string }>
  | IStatusLogBase<StatusTypesEnum.TOOL, StatusTools>
