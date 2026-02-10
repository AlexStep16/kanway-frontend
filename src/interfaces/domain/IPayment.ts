import { PaymentStatusesEnum } from '@/enums/PaymentStatusesEnum'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'

export interface IPayment {
  id: string
  serviceId: string
  description: string
  amount: string
  currency: string
  type: SubscriptionPlanEnum
  status: PaymentStatusesEnum
  userId: string
  createdAt: Date
  updatedAt: Date
}
