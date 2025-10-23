import WorkspaceModel from '@/models/WorkspaceModel'
import { WorkspaceValidationErrors } from '@interfaces/WorkspaceValidationErrors'

export function workspaceValidation(workspace: Partial<WorkspaceModel>): WorkspaceValidationErrors {
  const errors: WorkspaceValidationErrors = {
    name: {
      isValid: true,
      errorMessage: '',
    },
  }

  if (!workspace.name || workspace.name.trim().length === 0) {
    errors.name = {
      isValid: false,
      errorMessage: 'Введите название рабочего пространства',
    }
  }

  return errors
}
