import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invalidateUndo } from '@/helpers/invalidateUndo'
import { queryClient } from '@/plugins/queryClient'
import {
  boardKeys,
  categoryKeys,
  chatKeys,
  chatMessageKeys,
  taskKeys,
  userKeys,
  workspaceKeys,
} from '@/keys'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { useBoardStore } from './board'
import { useWorkspaceStore } from './workspace'
import { useUIStore } from './ui'
import WorkspaceModel from '@/models/WorkspaceModel'
import ChatMessageModel from '@/models/ChatMessageModel'
import { IOperationLog } from '@/interfaces/domain/IOperationLog'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { IChat } from '@/interfaces/domain/IChat'

export interface Event {
  id: string
  role: CustomEventsEnum
  status: 'progress' | 'completed' | 'failed'
  data: any
}

export const useAgentStatusStore = defineStore('agentStatus', () => {
  const activeJobId = ref<string | null>(null)
  const currentTool = ref<string | null>(null)
  const isStopped = ref(false)

  const uiStore = useUIStore()
  const boardStore = useBoardStore()
  const workspaceStore = useWorkspaceStore()

  const eventSource = ref<EventSource | null>(null)

  function connectSSE(jobId: string) {
    if (eventSource.value) eventSource.value.close()

    eventSource.value = new EventSource(
      import.meta.env.VITE_SERVER_BASE_URL + `/chats/stream/${jobId}/status`,
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

  function handleIncomingEvent(event: Event) {
    if (event.status === 'completed' || event.status === 'failed') {
      closeSSE()

      queryClient.invalidateQueries({ queryKey: userKeys.me })

      return
    }

    if (event.role === CustomEventsEnum.NEW_MESSAGE) {
      const message = event.data as ChatMessageModel

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(message.chatId),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages ? [...oldChatMessages, message] : [message]
        },
      )
    } else if (event.role === CustomEventsEnum.OPERATION) {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      queryClient.invalidateQueries({ queryKey: boardKeys.all })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all })

      const log = event.data as IOperationLog

      if (log.collectionName === 'boards') {
        if (log.operationType === 'CREATE') {
          if (log.entitiesAfter) boardStore.selectBoard(log.entitiesAfter[0], true) // Автоматически переключаемся на новую доску
        } else if (['DELETE', 'ARCHIVE'].includes(log.operationType)) {
          if (log.entitiesBefore) {
            if (log.entitiesBefore.some((b: any) => b.id === boardStore.activeBoardId)) {
              boardStore.resetBoardSelection()

              uiStore.selectChat() // Переключаемся на чат, если удалили/архивировали активную доску
            }
          }
        }
      }

      if (log.collectionName === 'workspaces') {
        if (log.operationType === 'CREATE') {
          if (log.entitiesAfter) workspaceStore.selectWorkspace(log.entitiesAfter[0], true) // Автоматически переключаемся на новое рабочее пространство
        }
      } else if (['DELETE', 'ARCHIVE'].includes(log.operationType)) {
        if (log.entitiesBefore) {
          if (log.entitiesBefore.some((w: any) => w.id === workspaceStore.activeWorkspaceId)) {
            const workspaces = queryClient.getQueryData<WorkspaceModel[]>(workspaceKeys.lists())

            if (workspaces && workspaces.length > 0) {
              const nextWorkspace = workspaces[0]
              workspaceStore.selectWorkspace(nextWorkspace, true)
            }
          }
        }
      }
    } else if (event.role === CustomEventsEnum.UPDATE_MESSAGE) {
      const message = event.data as ChatMessageModel

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(message.chatId),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages
            ? oldChatMessages.map((msg) => (msg.id === message.id ? { ...msg, ...message } : msg))
            : [message]
        },
      )
    } else if (event.role === CustomEventsEnum.UNDO) {
      invalidateUndo(event.data as IResponseWithLog<any>[])
    } else if (event.role === CustomEventsEnum.CHAT_UPDATED) {
      const data = event.data as IChat

      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(data.workspaceId) })
      queryClient.invalidateQueries({ queryKey: chatKeys.detailed(data.id) })
    }
  }

  async function closeSSE() {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    activeJobId.value = null
    currentTool.value = null
    isStopped.value = false
  }

  function isSSEActive() {
    return eventSource.value !== null
  }

  return {
    activeJobId,
    currentTool,
    isStopped,

    connectSSE,
    isSSEActive,
    closeSSE,
  }
})
