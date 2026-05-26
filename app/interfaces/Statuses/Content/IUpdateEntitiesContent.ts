export interface IUpdateEntitiesFilters {
  text: string
  value?: string
}

export interface IUpdateEntitiesContent {
  ids: string[]
  filters: IUpdateEntitiesFilters[]
  logId?: string
}
