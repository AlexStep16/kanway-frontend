import type { ITextValue } from './ITextValue'

export interface IDeleteArchiveEntitiesContent {
  count: number
  isSoftDelete?: boolean
  filters: ITextValue[]
  logId?: string
}
