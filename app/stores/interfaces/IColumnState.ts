import type { IColumn } from '~/interfaces/domain/IColumn'

export interface IColumnState extends IColumn {
  tempId?: string
}
