export interface ITaskFilters {
  isCompleted: boolean
  isInProgress: boolean
  isExpired: boolean
  isDueToday: boolean
  isDueTomorrow: boolean
  isDueThisWeek: boolean
  isNoColor: boolean
  tags: string[]
  colors: string[] // hex values, unique per color+tone
  priorities: ('low' | 'medium' | 'high')[]
}
