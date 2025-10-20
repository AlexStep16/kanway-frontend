export default interface User {
  _id: string
  username: string
  email: string
  role: string
  hasAvatar: boolean
  subscription: string
  subscription_until: Date
  generations_balance: number
  avatar_color: string
  is_tips_completed: boolean
  payment_method_id?: string
  ya_id?: string | null
}
