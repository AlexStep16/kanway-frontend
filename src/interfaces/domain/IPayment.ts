import { PaymentStatusEnum } from '@/enums/PaymentStatusEnum'

export interface IPayment {
  id: string
  description: string
  amount: number
  currency: string
  status: PaymentStatusEnum
  userId: string
  createdAt: Date
  updatedAt: Date
}
