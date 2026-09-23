import type { ICloneEntitiesContent } from '~/interfaces/Statuses/Content/ICloneEntitiesContent'
import type { IDeleteArchiveEntitiesContent } from '~/interfaces/Statuses/Content/IDeleteArchiveEntitiesContent'
import type { IMoveEntitiesContent } from '~/interfaces/Statuses/Content/IMoveEntitiesContent'
import type { IRecoverEntitiesContent } from '~/interfaces/Statuses/Content/IRecoverEntitiesContent'
import type { IReorderEntitiesContent } from '~/interfaces/Statuses/Content/IReorderEntitiesContent'
import type { ISearchEntitiesContent } from '~/interfaces/Statuses/Content/ISearchEntitiesContent'
import type { ISearchSemanticEntitiesContent } from '~/interfaces/Statuses/Content/ISearchSemanticEntitiesContent'
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue'
import type { IUpdateEntitiesContent } from '~/interfaces/Statuses/Content/IUpdateEntitiesContent'

export type StatusToolContentMap = {
  search_tasks: ISearchEntitiesContent
  search_tasks_semantic: ISearchSemanticEntitiesContent
  update_tasks: IUpdateEntitiesContent
  delete_archive_tasks: IDeleteArchiveEntitiesContent
  clone_tasks: ICloneEntitiesContent
  recover_tasks: IRecoverEntitiesContent
  move_tasks: IMoveEntitiesContent
  reorder_tasks: IReorderEntitiesContent

  search_columns: ISearchEntitiesContent
  update_columns: IUpdateEntitiesContent
  delete_archive_columns: IDeleteArchiveEntitiesContent
  clone_columns: ICloneEntitiesContent
  recover_columns: IRecoverEntitiesContent
  move_columns: IMoveEntitiesContent
  reorder_columns: IReorderEntitiesContent

  search_boards: ISearchEntitiesContent
  update_boards: IUpdateEntitiesContent
  delete_archive_boards: IDeleteArchiveEntitiesContent
  clone_boards: ICloneEntitiesContent
  recover_boards: IRecoverEntitiesContent
  move_boards: IMoveEntitiesContent
  reorder_boards: IReorderEntitiesContent

  search_workspaces: ISearchEntitiesContent
  update_workspaces: IUpdateEntitiesContent
  delete_archive_workspaces: IDeleteArchiveEntitiesContent
  clone_workspaces: ICloneEntitiesContent
  recover_workspaces: IRecoverEntitiesContent
  move_workspaces: IMoveEntitiesContent
  reorder_workspaces: IReorderEntitiesContent

  undo_operations: ITextValue[]
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
