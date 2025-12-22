import { AgentRolesEnum } from '@/enums/AgentRolesEnum'
import { AgentProgress } from '@/interfaces/AgentProgress'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useChatMessageStore } from '@stores/chatMessages'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useTaskDataStore } from '@stores/taskData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useBoardDataStore } from '@stores/boardData'
import { IBoard } from '@/interfaces/domain/IBoard'
import { ICategory } from '@/interfaces/domain/ICategory'
import { ITask } from '@/interfaces/domain/ITask'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'

export interface Event {
  status: 'progress' | 'completed' | 'failed'
  data: AgentProgress
}

//type AgentStatusErrorType = Nullable<BackendError | HttpError>

export const useAgentStatusStore = defineStore('agentStatus', () => {
  const CHAT_MESSAGE_STORE = useChatMessageStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()
  const TASK_STORE = useTaskDataStore()
  const CATEGORY_STORE = useCategoryDataStore()
  const BOARD_STORE = useBoardDataStore()

  const activeJobId = ref<string | null>(null)
  const currentActivity = ref<string | null>(null)

  const assistantStream = ref<string>('')

  const eventSource = ref<EventSource | null>(null)

  function connectSSE(jobId: string) {
    if (!WORKSPACE_STORE.activeWorkspace) return
    if (eventSource.value) eventSource.value.close()

    currentActivity.value = 'Думаю...'

    eventSource.value = new EventSource(
      import.meta.env.VITE_SERVER_BASE_URL +
        `/workspaces/${WORKSPACE_STORE.activeWorkspace.id}/chats/stream/${jobId}/status`,
      {
        withCredentials: true,
      },
    )
    activeJobId.value = jobId

    eventSource.value.onmessage = (event: MessageEvent<string>) => {
      handleIncomingEvent(JSON.parse(event.data))
    }

    eventSource.value.onerror = (error) => {
      console.error('SSE Error:', error)
      closeSSE()
    }
  }

  // Обработка DTO (role, content, etc.)
  function handleIncomingEvent(event: Event) {
    const data = event.data

    if (event.status === 'completed' || event.status === 'failed') {
      closeSSE()

      return
    }

    if (data.role === AgentRolesEnum.TOOLS_EXECUTION) {
      currentActivity.value = data.title || 'Выполнение инструмента...'
    } else if (data.role === AgentRolesEnum.ASSISTANT_CHUNK) {
      assistantStream.value += data.content
    } else if (data.role === AgentRolesEnum.NEW_MESSAGE) {
      CHAT_MESSAGE_STORE.addChatMessages([data.message])
    } else if (data.role === AgentRolesEnum.INTEGRATION) {
      const integration = data.integration

      if (integration.create) {
        const data = integration.create

        BOARD_STORE.integrateBoards(data.boards || [])
        CATEGORY_STORE.integrateCategories(data.categories || [])
        TASK_STORE.integrateTasks(data.tasks || [])
        WORKSPACE_STORE.integrateWorkspaces(data.workspaces || [])
      }
      if (integration.update) {
        const data = integration.update

        BOARD_STORE.integrateBoards(data.boards || [])
        CATEGORY_STORE.integrateCategories(data.categories || [])
        TASK_STORE.integrateTasks(data.tasks || [])
        WORKSPACE_STORE.integrateWorkspaces(data.workspaces || [])
      }
      if (integration.delete) {
        const data = integration.delete

        BOARD_STORE.deleteFromStore(data.boards?.map((b: IBoard) => b.id) || [])
        CATEGORY_STORE.deleteFromStore(data.categories?.map((c: ICategory) => c.id) || [])
        TASK_STORE.deleteFromStore(data.tasks?.map((t: ITask) => t.id) || [])
        WORKSPACE_STORE.deleteFromStore(data.workspaces?.map((w: IWorkspace) => w.id) || [])
      }
    }
  }

  function closeSSE() {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    activeJobId.value = null
    assistantStream.value = ''
    currentActivity.value = null
  }

  return {
    activeJobId,
    currentActivity,
    assistantStream,

    connectSSE,
    closeSSE,
  }
})
