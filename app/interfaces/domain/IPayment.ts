import type { PaymentItemIdEnum } from '~/enums/PaymentItemIdEnum'
import { PaymentStatusesEnum } from '~/enums/PaymentStatusesEnum'
import type { PaymentTypeEnum } from '~/enums/PaymentTypeEnum'

export interface IPayment {
  id: string
  serviceId?: string
  description: string
  amount: string
  currency: string
  column: PaymentTypeEnum
  itemId: PaymentItemIdEnum
  status: PaymentStatusesEnum
  userId: string
  createdAt: Date
  updatedAt: Date
}
