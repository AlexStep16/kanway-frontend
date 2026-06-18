import { CustomEventsEnum } from '~/enums/CustomEventsEnum'

import { useBoardStore } from './board'
import { useWorkspaceStore } from './workspace'
import { useUIStore } from './ui'

import WorkspaceModel from '~/models/WorkspaceModel'
import ChatMessageModel from '~/models/ChatMessageModel'

import type { IOperationLog } from '~/interfaces/domain/IOperationLog'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'

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
    const runtimeConfig = useRuntimeConfig()
    if (eventSource.value) eventSource.value.close()

    eventSource.value = new EventSource(
      runtimeConfig.public.serverApiUrl + `/chats/stream/${jobId}/status`,
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
    const { $queryClient } = useNuxtApp()

    if (event.status === 'completed' || event.status === 'failed') {
      closeSSE()

      $queryClient.invalidateQueries({ queryKey: userKeys.me })

      return
    }

    if (event.role === CustomEventsEnum.NEW_MESSAGE) {
      const message = event.data as ChatMessageModel

      $queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(message.chatId),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages ? [...oldChatMessages, message] : [message]
        },
      )
    } else if (event.role === CustomEventsEnum.OPERATION) {
      $queryClient.invalidateQueries({ queryKey: taskKeys.all })
      $queryClient.invalidateQueries({ queryKey: columnKeys.all })
      $queryClient.invalidateQueries({ queryKey: boardKeys.all })
      $queryClient.invalidateQueries({ queryKey: workspaceKeys.all })

      const log = event.data as IOperationLog

      if (log.collectionName === 'boards') {
        if (log.operationType === 'CREATE') {
          if (log.entitiesAfter) boardStore.selectBoard(log.entitiesAfter[0].id)
        } else if (['DELETE', 'ARCHIVE'].includes(log.operationType)) {
          if (log.entitiesBefore?.some((b: any) => b.id === boardStore.activeBoardId)) {
            boardStore.navigateToChat()
          }
        }
      }

      if (log.collectionName === 'workspaces') {
        if (log.operationType === 'CREATE') {
          if (log.entitiesAfter) workspaceStore.selectWorkspace(log.entitiesAfter[0])
        }
      } else if (['DELETE', 'ARCHIVE'].includes(log.operationType)) {
        if (log.entitiesBefore?.some((w: any) => w.id === workspaceStore.activeWorkspaceId)) {
          const workspaces = $queryClient.getQueryData<WorkspaceModel[]>(workspaceKeys.lists())
          const nextWorkspace = workspaces?.[0]
          if (nextWorkspace) workspaceStore.selectWorkspace(nextWorkspace)
        }
      }
    } else if (event.role === CustomEventsEnum.UPDATE_MESSAGE) {
      const message = event.data as ChatMessageModel

      $queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(message.chatId),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages
            ? oldChatMessages.map((msg) => (msg.id === message.id ? { ...msg, ...message } : msg))
            : [message]
        },
      )
    } else if (event.role === CustomEventsEnum.UNDO) {
      invalidateUndo(event.data as IResponseWithLog<any>[])
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
