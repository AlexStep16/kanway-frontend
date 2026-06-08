import ColumnModel from '~/models/ColumnModel'
import type { IColumn } from '~/interfaces/domain/IColumn'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'
import type { IColumnCreateApiPayload } from '~/interfaces/IColumnCreateApiPayload'
import type { IColumnEditApiPayload } from '~/interfaces/IColumnEditApiPayload'
import type { IColumnMoveApiPayload } from '~/interfaces/IColumnMoveApiPayload'

export function transformColumn(raw: IColumn): IColumnState {
  const columnModel = new ColumnModel({
    ...raw,
    deletedTime: raw.deletedTime ? new Date(raw.deletedTime) : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  return {
    ...columnModel,
    tempId: (raw as any).tempClientId,
  }
}

export async function fetchColumns(boardId?: string) {
  const columns = await getColumnsApi(boardId)

  return columns.map(transformColumn)
}

export async function fetchColumn(id: string) {
  const columns = await getColumnApi(id)
  const column = columns.length > 0 ? columns[0] : null

  return column ? transformColumn(column) : null
}

export async function fetchArchivedColumns() {
  const columns = await getArchivedColumnsApi()

  return columns.map(transformColumn)
}

export async function createColumn(
  payload: IColumnCreateApiPayload,
): Promise<IResponseWithLog<IColumn[]>> {
  const newColumn = await postColumnApi(payload)

  return {
    data: newColumn.data.map(transformColumn),
    logId: newColumn.logId,
  }
}

export async function saveColumn(
  payload: IColumnEditApiPayload,
): Promise<IResponseWithLog<IColumn[]>> {
  const saveResult = await patchColumnApi(payload)

  return {
    data: saveResult.data.map(transformColumn),
    logId: saveResult.logId,
  }
}

export async function saveColumns(
  payload: IColumnEditApiPayload[],
): Promise<IResponseWithLog<IColumn[]>> {
  const saveResult = await bulkUpdateColumnsApi(payload)

  return {
    data: saveResult.data.map(transformColumn),
    logId: saveResult.logId,
  }
}

export async function removeColumn(id: string): Promise<IResponseWithLog<null>> {
  return await deleteColumnApi(id)
}

export async function archiveColumn(id: string): Promise<IResponseWithLog<IColumn[]>> {
  const archiveResult = await archiveColumnApi(id)

  return {
    data: archiveResult.data.map(transformColumn),
    logId: archiveResult.logId,
  }
}

export async function moveColumn(
  payload: IColumnMoveApiPayload,
): Promise<IResponseWithLog<IColumn[]>> {
  return await moveColumnApi(payload)
}

export async function recoverColumn(id: string): Promise<IResponseWithLog<IColumn[]>> {
  const recoverResult = await recoverColumnApi(id)

  return {
    data: recoverResult.data.map(transformColumn),
    logId: recoverResult.logId,
  }
}

export async function cloneColumn(id: string): Promise<IResponseWithLog<IColumn[]>> {
  const cloneResult = await cloneColumnApi(id)

  return {
    data: cloneResult.data.map(transformColumn),
    logId: cloneResult.logId,
  }
}
