import { AiConfirmationTypeEnum } from '~/enums/AiConfirmationTypeEnum'
import type { ISetting } from '~/interfaces/domain/ISetting'

export default class SettingModel implements ISetting {
  public id: string
  public aiName: string
  public aiConfirmationType: AiConfirmationTypeEnum
  public aiDefaultCategory: string
  public aiDefaultBoard: string
  public userId: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: ISetting) {
    this.id = props.id
    this.aiName = props.aiName
    this.aiConfirmationType = props.aiConfirmationType
    this.aiDefaultCategory = props.aiDefaultCategory
    this.aiDefaultBoard = props.aiDefaultBoard
    this.userId = props.userId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
