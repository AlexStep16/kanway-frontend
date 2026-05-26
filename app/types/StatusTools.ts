import type { ISearchEntitiesContent } from '~/interfaces/Statuses/Content/ISearchEntitiesContent'
import type { IUpdateEntitiesContent } from '~/interfaces/Statuses/Content/IUpdateEntitiesContent'

export type SearchTasksTool = {
  id: string
  name: 'search_tasks'
  content: ISearchEntitiesContent
}

export type UpdateTasksTool = {
  id: string
  name: 'update_tasks'
  content: IUpdateEntitiesContent
}

export type StatusTools = SearchTasksTool | UpdateTasksTool
