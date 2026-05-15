export interface ISubscription {
  id: string
  subscriptionId: number
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  limitWorkspaces: number
  limitBoards: number
}
