import { Nullable } from '@/types/utils'
import { BackendError, HttpError } from '@/utils/errors'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { undoOperation } from '@/services/log'
import { IWorkspacesWithChildrenResponse } from '@/interfaces/IWorkspacesWithChildrenResponse'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ErrorsMessage } from '@/enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { IUndoResponse } from '@/interfaces/IUndoResponse'
import { useRootStore } from '@stores/root'

type LogErrorType = Nullable<BackendError | HttpError>

export const useLogStore = defineStore('log', () => {
  const ROOT_STORE = useRootStore()

  // Errors
  const _undoError = ref<Map<string, LogErrorType>>(new Map())

  //Loading
  const _undoLoading = ref<Set<string>>(new Set())

  function isDataEmpty(data: IUndoResponse<Partial<IWorkspacesWithChildrenResponse>>): boolean {
    function hasSomeChildren(data: Partial<IWorkspacesWithChildrenResponse>) {
      return (
        (!data.workspaces || data.workspaces.length === 0) &&
        (!data.boards || data.boards.length === 0) &&
        (!data.categories || data.categories.length === 0) &&
        (!data.tasks || data.tasks.length === 0)
      )
    }

    for (const key in data) {
      const value = data[key as keyof IUndoResponse<Partial<IWorkspacesWithChildrenResponse>>]

      if (value && !hasSomeChildren(value)) {
        return false
      }
    }

    return true
  }

  async function _undo(
    id: string,
  ): Promise<IUndoResponse<Partial<IWorkspacesWithChildrenResponse>>> {
    if (!id) throw new Error('Не указан ID операции для отмены')

    _undoError.value.delete(id)

    try {
      _undoLoading.value.add(id)

      const coreAction = () => undoOperation(id)

      const undoResult = await requestQueueService.enqueue(id, coreAction)

      if (isDataEmpty(undoResult)) throw new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)

      return undoResult
    } catch (e) {
      if (e instanceof BackendError) {
        _undoError.value.set(id, e)
      } else if (e instanceof HttpError) {
        _undoError.value.set(id, e)

        if (e.status === 401) {
        }
      } else {
        _undoError.value.set(id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
      }

      throw e
    } finally {
      _undoLoading.value.delete(id)
    }
  }

  async function undo(id: string) {
    try {
      const undoResult = await _undo(id)

      ROOT_STORE.integrateEntities(undoResult)

      toast.success('Операция успешно отменена')
    } catch (e) {
      console.error(e)
      toast.error(_undoError.value.get(id)?.message || 'Ошибка при отмене операции')
    }
  }

  const isUndoing = (id: string): boolean => {
    return _undoLoading.value.has(id)
  }

  return {
    //States
    isUndoing,

    //Actions
    undo,
  }
})
