export default interface UserRaw {
  _id: string
  username?: string
  email: string
  role: 'user' | 'admin'
  hasAvatar: boolean
  subscription: string
  subscription_until?: string
  generations_balance: number
  is_tips_completed: boolean
  avatar_color: string
  payment_method_id?: string
  ya_id?: string
  createdAt: string
  updatedAt: string
}
