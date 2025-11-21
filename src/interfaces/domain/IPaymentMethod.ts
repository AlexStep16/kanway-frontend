export interface IPaymentMethod {
  id: string
  serviceId: string
  type: string
  cardFirst6: string
  cardLast4: string
  cardType: string
  expiryMonth: number
  expiryYear: number
  userId: string
  createdAt: Date
  updatedAt: Date
}
