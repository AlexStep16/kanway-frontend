import type { IPayment } from '~/interfaces/domain/IPayment'

type IConfirmationType = 'embedded' | 'external' | 'qr' | 'redirect'

export interface IBuySubscriptionResponse {
  model: IPayment
  payment: {
    confirmation: {
      type: IConfirmationType
      locale?: string
      confirmation_token?: string
      confirmation_data?: string
      confirmation_url?: string
      enforce?: boolean
      return_url?: string
    }
  }
}
