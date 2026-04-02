import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUIStore } from '@stores/ui'
import { IChat } from '@/interfaces/domain/IChat'

export const useChatStore = defineStore('chat', () => {
  const activeChat = ref<IChat | null>(null)

  const uiStore = useUIStore()

  function newChat() {
    activeChat.value = null
    uiStore.isChatOpen = true
  }

  function selectChat(chat: IChat) {
    activeChat.value = chat
    uiStore.isChatOpen = true
  }

  function closeChat() {
    activeChat.value = null
    uiStore.isChatOpen = false
  }

  return { activeChat, newChat, selectChat, closeChat }
})
