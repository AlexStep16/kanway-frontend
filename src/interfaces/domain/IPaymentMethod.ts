type IPaymentMethodType =
  | 'bank_card'
  | 'apple_pay'
  | 'google_pay'
  | 'yoo_money'
  | 'qiwi'
  | 'webmoney'
  | 'sberbank'
  | 'alfabank'
  | 'tinkoff_bank'
  | 'b2b_sberbank'
  | 'sbp'
  | 'mobile_balance'
  | 'cash'
  | 'installments'

export interface IPaymentMethod {
  id: string
  serviceId: string
  paymentId: string
  type: IPaymentMethodType
  cardFirst6?: string
  cardLast4?: string
  cardType?: string
  cardExpiryMonth?: string
  cardExpiryYear?: string
  phone?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
