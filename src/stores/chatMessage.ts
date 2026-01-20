import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useChatStore } from '@stores/chat'
import ChatMessageModel from '@/models/ChatMessageModel'

export const useChatMessageStore = defineStore('chatMessage', () => {
  const CHAT_STORE = useChatStore()

  const messages = ref<ChatMessageModel[]>([])

  function updateChatMessageInStore(updatedMessage: ChatMessageModel) {
    const index = messages.value.findIndex((m) => m.id === updatedMessage.id)

    if (index !== -1) {
      Object.assign(messages.value[index], updatedMessage)
    }
  }

  const isLastMessageFromHuman = computed(() => {
    const lastMessage = currentChatMessages.value.at(-1) || null

    if (lastMessage && lastMessage.role === 'user') {
      return true
    } else return false
  })

  function removeChatMessageFromStore(messageId: string) {
    messages.value = messages.value.filter((m) => m.id !== messageId)
  }

  function deleteFromStore(messageIds: string[]) {
    messages.value = messages.value.filter((m) => !messageIds.includes(m.id))
  }

  function addChatMessages(newMessages: ChatMessageModel[]) {
    messages.value.push(...newMessages)
  }

  const currentChatMessages = computed(() => {
    return messages.value.filter((message) => message.chatId === CHAT_STORE.activeChatId)
  })

  return {
    //States
    messages,
    currentChatMessages,

    //Actions
    addChatMessages,
    updateChatMessageInStore,
    deleteFromStore,
    removeChatMessageFromStore,
    isLastMessageFromHuman,
  }
})
