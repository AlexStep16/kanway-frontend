import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import type { IEntityActionConfirmationContent } from '~/interfaces/IEntityActionConfirmationContent'

export interface IToolApproveEntityActionMessage extends IChatMessage {
  content: IEntityActionConfirmationContent[]
}
