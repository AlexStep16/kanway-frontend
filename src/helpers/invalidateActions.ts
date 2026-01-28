import { IBoard } from '@/interfaces/domain/IBoard'
import { IActionResponse } from '@/interfaces/IActionResponse'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'

export function invalidateActions(actions: IActionResponse) {
  queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })

  if (actions.create) {
    if (actions.create.boards) {
      actions.create.boards.forEach((board) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
      })
    }

    if (actions.create.categories) {
      actions.create.categories.forEach((category) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(category.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
      })
    }

    if (actions.create.tasks) {
      actions.create.tasks.forEach((task) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(task.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(task.board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      })
    }
  }

  if (actions.clone) {
    if (actions.clone.boards) {
      actions.clone.boards.forEach((board) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
      })
    }

    if (actions.clone.categories) {
      actions.clone.categories.forEach((category) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(category.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
      })
    }

    if (actions.clone.tasks) {
      actions.clone.tasks.forEach((task) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(task.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(task.board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      })
    }
  }

  if (actions.edit) {
    if (actions.edit.boards) {
      actions.edit.boards.forEach((board) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
      })
    }

    if (actions.edit.categories) {
      actions.edit.categories.forEach((category) => {
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(category.board.id) })
      })
    }

    if (actions.edit.tasks) {
      actions.edit.tasks.forEach((task) => {
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      })
    }
  }

  if (actions.delete) {
    if (actions.delete.workspaces) {
      actions.delete.workspaces.forEach((workspace) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(workspace.id) })

        const boards = queryClient.getQueryData<IBoard[]>(boardKeys.byWorkspace(workspace.id))
        if (boards && boards.length > 0) {
          boards.forEach((board) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
            queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
          })
        }
      })
    }
    if (actions.delete.boards) {
      actions.delete.boards.forEach((board) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
      })
    }

    if (actions.delete.categories) {
      actions.delete.categories.forEach((category) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(category.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(category.board.id) })
      })
    }

    if (actions.delete.tasks) {
      actions.delete.tasks.forEach((task) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(task.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(task.board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      })
    }
  }

  if (actions.archive) {
    if (actions.archive.workspaces) {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.archived() })

      actions.archive.workspaces.forEach((workspace) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(workspace.id) })

        const boards = queryClient.getQueryData<IBoard[]>(boardKeys.byWorkspace(workspace.id))
        if (boards && boards.length > 0) {
          boards.forEach((board) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
            queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
          })
        }
      })
    }

    if (actions.archive.boards) {
      queryClient.invalidateQueries({ queryKey: boardKeys.archived() })

      actions.archive.boards.forEach((board) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
      })
    }

    if (actions.archive.categories) {
      queryClient.invalidateQueries({ queryKey: categoryKeys.archived() })

      actions.archive.categories.forEach((category) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(category.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(category.board.id) })
      })
    }

    if (actions.archive.tasks) {
      queryClient.invalidateQueries({ queryKey: taskKeys.archived() })

      actions.archive.tasks.forEach((task) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(task.workspace.id) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(task.board.id) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      })
    }
  }

  if (actions.recover) {
    if (actions.recover.workspaces) {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.archived() })
    }

    if (actions.recover.boards) {
      queryClient.invalidateQueries({ queryKey: boardKeys.archived() })

      actions.recover.boards.forEach((board) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
      })
    }

    if (actions.recover.categories) {
      actions.recover.categories.forEach((category) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(category.workspace.id) })
      })
    }

    if (actions.recover.tasks) {
      actions.recover.tasks.forEach((task) => {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(task.workspace.id) })
      })
    }
  }
}
