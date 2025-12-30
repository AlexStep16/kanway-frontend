import { AgentRolesEnum } from '@/enums/AgentRolesEnum'
import { AgentProgress } from '@/interfaces/AgentProgress'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useChatMessageStore } from '@stores/chatMessages'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useRootStore } from '@stores/root'

export interface Event {
  status: 'progress' | 'completed' | 'failed'
  data: AgentProgress
}

//type AgentStatusErrorType = Nullable<BackendError | HttpError>

export const useAgentStatusStore = defineStore('agentStatus', () => {
  const CHAT_MESSAGE_STORE = useChatMessageStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()
  const ROOT_STORE = useRootStore()

  const activeJobId = ref<string | null>(null)
  const currentActivity = ref<string | null>(null)

  const assistantStream = ref<string>('')

  const eventSource = ref<EventSource | null>(null)

  function connectSSE(jobId: string) {
    if (!WORKSPACE_STORE.activeWorkspace) return
    if (eventSource.value) eventSource.value.close()

    currentActivity.value = 'Думаю'

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
      currentActivity.value = data.title || 'Выполнение инструмента'
    } else if (data.role === AgentRolesEnum.ASSISTANT_CHUNK) {
      assistantStream.value += data.content
    } else if (data.role === AgentRolesEnum.NEW_MESSAGE) {
      CHAT_MESSAGE_STORE.addChatMessages([data.message])
    } else if (data.role === AgentRolesEnum.INTEGRATION) {
      const integration = data.integration

      ROOT_STORE.integrateEntities(integration)
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

  function isSSEActive() {
    return eventSource.value !== null
  }

  return {
    activeJobId,
    currentActivity,
    assistantStream,

    connectSSE,
    isSSEActive,
    closeSSE,
  }
})
