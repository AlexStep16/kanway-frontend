import { PaymentStatusesEnum } from '~/enums/PaymentStatusesEnum'

interface IAmount {
  currency: string
  value: string
}

export interface IPaymentStatus {
  id: string
  status: PaymentStatusesEnum
  paid: boolean
  amount: IAmount
  income_amount: IAmount
  refunded_amount: IAmount
  created_at: string
  description: string
  expires_at: string
  captured_at: string
  metadata: any
  payment_token: string
  payment_method_id: string
  confirmation: {
    type: string
    confirmation_url: string
  }
  save_payment_method: boolean
  capture: boolean
  client_ip: string
  refundable: boolean
  test: boolean
  cancellation_details: {
    party: 'merchant' | 'yoo_money' | 'payment_network'
    reason: string
  }
  authorization_details: {
    auth_code: string
    rrn: string
  }
  merchant_customer_id?: string
}
