import { defineStore, Pinia } from 'pinia'
import { Ref, ref, toRef } from 'vue'
import { Nullable } from '@/types/utils'
import { useWorkspaceStore } from '@stores/workspace'
import { IBoard } from '@/interfaces/domain/IBoard'
import { useUIStore } from '@stores/ui'

export const useBoardStore = (pinia?: Pinia) => {
  return defineStore('board', () => {
    const WORKSPACE_STORE = useWorkspaceStore(pinia)
    const UI_STORE = useUIStore(pinia)

    const activeBoardId = ref<Nullable<string>>(null)
    const activeWorkspaceId = toRef(WORKSPACE_STORE, 'activeWorkspaceId') as Ref<Nullable<string>>

    async function selectBoard(board: IBoard, shouldNavigate: boolean = false) {
      if (!board || board.id === activeBoardId.value) return

      if (activeWorkspaceId.value && shouldNavigate) {
        window.history.pushState(
          { triggeredBy: 'user' },
          '',
          `/workspace/${activeWorkspaceId.value}/${board.id}`,
        )
      }

      activeBoardId.value = board.id
      localStorage.setItem('activeBoardId', board.id)

      setTimeout(() => (document.title = 'Kanway | ' + board.name), 0)

      UI_STORE.selectBoard() // Change current UI view to board view
    }

    function resetBoardSelection() {
      activeBoardId.value = null
      localStorage.removeItem('activeBoardId')
    }

    return {
      activeBoardId,

      selectBoard,
      resetBoardSelection,
    }
  })(pinia)
}
