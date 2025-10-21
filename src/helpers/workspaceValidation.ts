import { Workspace } from '@interfaces/Workspace'
import { WorkspaceValidationErrors } from '@interfaces/WorkspaceValidationErrors'

export function workspaceValidation(workspace: Partial<Workspace>): WorkspaceValidationErrors {
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
