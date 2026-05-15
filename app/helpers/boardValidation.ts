import type { BoardValidationErrors } from '~/interfaces/BoardValidationErrors'
import BoardModel from '~/models/BoardModel'

export function boardValidation(board: Partial<BoardModel>): BoardValidationErrors {
  const errors: BoardValidationErrors = {
    name: {
      isValid: true,
      errorMessage: '',
    },
  }

  if (!board.name || board.name.trim().length === 0) {
    errors.name = {
      isValid: false,
      errorMessage: 'Введите название доски',
    }
  }

  return errors
}
