export interface ITaskFilters {
  isCompleted: boolean
  isInProgress: boolean
  isExpired: boolean
  isDueToday: boolean
  isDueTomorrow: boolean
  isDueThisWeek: boolean
  tags: string[]
}
