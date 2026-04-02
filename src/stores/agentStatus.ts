import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import { AgentProgress } from '@/interfaces/AgentProgress'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { invalidateUndo } from '@/helpers/invalidateUndo'
import { queryClient } from '@/plugins/queryClient'
import { boardKeys, categoryKeys, chatMessageKeys, taskKeys, workspaceKeys } from '@/keys'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

export interface Event {
  status: 'progress' | 'completed' | 'failed'
  data: AgentProgress
}

//type AgentStatusErrorType = Nullable<BackendError | HttpError>

export const useAgentStatusStore = defineStore('agentStatus', () => {
  const activeJobId = ref<string | null>(null)
  const currentTool = ref<string | null>(null)
  const timeElapsed = ref(0)

  let timerInterval: number | null = null

  // Форматирование времени MM:SS или S.s
  const formattedTime = computed(() => {
    const seconds = Math.floor(timeElapsed.value / 1000)
    const ms = Math.floor((timeElapsed.value % 1000) / 100) // Десятые доли секунды

    if (seconds < 60) {
      return `${seconds}.${ms}c` // Показывем "4.5s" для динамики
    }

    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  })

  const startTimer = () => {
    const start = Date.now()
    // Сбрасываем при новом старте
    timeElapsed.value = 0

    timerInterval = window.setInterval(() => {
      timeElapsed.value = Date.now() - start
    }, 100) // Обновляем каждые 100мс для плавности
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const eventSource = ref<EventSource | null>(null)

  function connectSSE(jobId: string) {
    if (eventSource.value) eventSource.value.close()

    startTimer()

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

  // Обработка DTO (role, content, etc.)
  function handleIncomingEvent(event: Event) {
    const eventData = event.data

    if (event.status === 'completed' || event.status === 'failed') {
      closeSSE()

      return
    }

    if (eventData.role === CustomEventsEnum.NEW_MESSAGE) {
      const message = eventData.data

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(message.chatId),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages ? [...oldChatMessages, message] : [message]
        },
      )
    } else if (eventData.role === CustomEventsEnum.OPERATION) {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      queryClient.invalidateQueries({ queryKey: boardKeys.all })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all })
    } else if (eventData.role === CustomEventsEnum.UPDATE_MESSAGE) {
      const message = eventData.data

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(message.chatId),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages
            ? oldChatMessages.map((msg) => (msg.id === message.id ? { ...msg, ...message } : msg))
            : [message]
        },
      )
    } else if (eventData.role === CustomEventsEnum.UNDO) {
      invalidateUndo(eventData.data)
    }
  }

  async function closeSSE() {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    activeJobId.value = null
    currentTool.value = null

    stopTimer()
  }

  function isSSEActive() {
    return eventSource.value !== null
  }

  return {
    activeJobId,
    currentTool,
    formattedTime,

    connectSSE,
    isSSEActive,
    closeSSE,
  }
})
