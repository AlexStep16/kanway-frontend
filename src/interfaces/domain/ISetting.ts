import { AiConfirmationTypeEnum } from '@enums/AiConfirmationTypeEnum'

export interface ISetting {
  id: string
  aiName: string
  aiConfirmationType: AiConfirmationTypeEnum
  aiDefaultCategory: string
  aiDefaultBoard: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
