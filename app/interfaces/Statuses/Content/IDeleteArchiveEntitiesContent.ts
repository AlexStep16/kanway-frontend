import type { ITextValue } from './ITextValue'

export interface IDeleteArchiveEntitiesContent {
  ids: string[]
  isSoftDelete?: boolean
  filters: ITextValue[]
  logId?: string
}
