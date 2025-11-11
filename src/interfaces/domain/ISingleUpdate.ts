export type ISingleUpdate<TEntity> = Partial<TEntity> & {
  id: string
  isReorderNeeded?: boolean
  isMoveNeeded?: boolean
}
