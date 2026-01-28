import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUIStore } from '@stores/ui'
import { IChat } from '@/interfaces/domain/IChat'

export const useChatStore = defineStore('chat', () => {
  const activeChat = ref<IChat | null>(null)

  const uiStore = useUIStore()

  function selectChat(chat: IChat, openModal = false) {
    activeChat.value = chat

    if (openModal) {
      uiStore.openChatModal()
    }
  }

  return { activeChat, selectChat }
})
