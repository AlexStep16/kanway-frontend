import type { ICloneEntitiesContent } from '~/interfaces/Statuses/Content/ICloneEntitiesContent'
import type { IDeleteArchiveEntitiesContent } from '~/interfaces/Statuses/Content/IDeleteArchiveEntitiesContent'
import type { IMoveEntitiesContent } from '~/interfaces/Statuses/Content/IMoveEntitiesContent'
import type { IRecoverEntitiesContent } from '~/interfaces/Statuses/Content/IRecoverEntitiesContent'
import type { ISearchEntitiesContent } from '~/interfaces/Statuses/Content/ISearchEntitiesContent'
import type { IUpdateEntitiesContent } from '~/interfaces/Statuses/Content/IUpdateEntitiesContent'

export type StatusToolContentMap = {
  search_tasks: ISearchEntitiesContent
  update_tasks: IUpdateEntitiesContent
  delete_archive_tasks: IDeleteArchiveEntitiesContent
  clone_tasks: ICloneEntitiesContent
  recover_tasks: IRecoverEntitiesContent
  move_tasks: IMoveEntitiesContent

  search_categories: ISearchEntitiesContent
  update_categories: IUpdateEntitiesContent
  delete_archive_categories: IDeleteArchiveEntitiesContent
  clone_categories: ICloneEntitiesContent
  recover_categories: IRecoverEntitiesContent
  move_categories: IMoveEntitiesContent
}

export type StatusToolName = keyof StatusToolContentMap

export type StatusToolByName<TName extends StatusToolName = StatusToolName> = {
  id: string
  name: TName
  content: StatusToolContentMap[TName]
}

export type StatusTools = {
  [TName in StatusToolName]: StatusToolByName<TName>
}[StatusToolName]
