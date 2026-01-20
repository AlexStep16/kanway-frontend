import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUIStore } from '@stores/ui'

export const useChatStore = defineStore('chat', () => {
  const activeChatId = ref<string | null>(null)

  const uiStore = useUIStore()

  function selectChat(chatId: string, openModal = false) {
    activeChatId.value = chatId

    if (openModal) {
      uiStore.openChatModal()
    }
  }

  return { activeChatId, selectChat }
})
