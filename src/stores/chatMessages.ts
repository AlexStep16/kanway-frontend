import { Nullable } from '@/types/utils'
import { BackendError, HttpError } from '@/utils/errors'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@/enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import ChatMessageModel from '@models/ChatMessageModel'
import { fetchChatMessages } from '@/services/chatMessage'
import { useChatStore } from '@stores/chat'

type ChatMessageErrorType = Nullable<BackendError | HttpError>

export const useChatMessageStore = defineStore('chatMessage', () => {
  const CHAT_STORE = useChatStore()

  const messages = ref<ChatMessageModel[]>([])

  // Errors
  const loadChatMessagesError = ref<ChatMessageErrorType>(null)

  //Loading
  const _loadingStatusChats = ref<Map<string, boolean>>(new Map())
  const _loadedChats = ref<Set<string>>(new Set())

  async function loadChatMessages(
    workspaceId: string,
    chatId: string,
    force_reload: boolean = false,
  ) {
    if (areChatMessagesLoaded(chatId) && !force_reload) return
    if (areChatMessagesLoading(chatId)) return
    if (_loadingStatusChats.value.get(chatId)) return

    _loadingStatusChats.value.set(chatId, true)

    loadChatMessagesError.value = null

    try {
      const chatMessagesPayload = await fetchChatMessages(workspaceId, chatId)

      messages.value = messages.value.filter((c) => c.chatId !== chatId) // Remove old chat messages of this workspace

      messages.value.push(...chatMessagesPayload)
      _loadedChats.value.add(chatId)

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadChatMessagesError.value = e
      } else if (e instanceof HttpError) {
        loadChatMessagesError.value = e

        if (e.status === 401) {
        }
      } else {
        loadChatMessagesError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadChatMessagesError.value.message)

      return false
    } finally {
      _loadingStatusChats.value.set(chatId, false)
    }
  }

  function updateChatMessageInStore(updatedMessage: ChatMessageModel) {
    const index = messages.value.findIndex((m) => m.id === updatedMessage.id)

    if (index !== -1) {
      Object.assign(messages.value[index], updatedMessage)
    }
  }

  function deleteFromStore(messageIds: string[]) {
    messages.value = messages.value.filter((m) => !messageIds.includes(m.id))
  }

  function addChatMessages(newMessages: ChatMessageModel[]) {
    messages.value.push(...newMessages)
  }

  function areChatMessagesLoading(chatId: string): boolean {
    return _loadingStatusChats.value.has(chatId)
  }

  function areChatMessagesLoaded(chatId: string): boolean {
    return _loadedChats.value.has(chatId)
  }

  const currentChatMessages = computed(() => {
    return messages.value.filter((message) => message.chatId === CHAT_STORE.activeChatId)
  })

  return {
    //States
    loadChatMessagesError,
    messages,
    currentChatMessages,

    //Actions
    loadChatMessages,
    addChatMessages,
    updateChatMessageInStore,
    deleteFromStore,
  }
})
