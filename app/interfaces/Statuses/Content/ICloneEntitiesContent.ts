import type { ITextValue } from './ITextValue.js'

export interface ICloneEntitiesContent {
  ids: string[]
  filters: ITextValue[]
  logId?: string
}
