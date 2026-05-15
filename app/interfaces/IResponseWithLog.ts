export interface IResponseWithLog<TEntity> {
  data: TEntity
  logId: string | null
}
