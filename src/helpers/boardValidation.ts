import { BoardValidationErrors } from '@interfaces/BoardValidationErrors'
import { Board } from '@interfaces/Board'

export function boardValidation(board: Partial<Board>): BoardValidationErrors {
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
