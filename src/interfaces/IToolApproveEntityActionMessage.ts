import { IChatMessage } from './domain/IChatMessage'
import { IEntityActionConfirmationContent } from './IEntityActionConfirmationContent'

export interface IToolApproveEntityActionMessage extends IChatMessage {
  content: IEntityActionConfirmationContent[]
}
