import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUIStore } from '@stores/ui'
import { IChat } from '@/interfaces/domain/IChat'
import { useAuthStore } from './auth'
import { useWorkspaceStore } from './workspace'

export const useChatStore = defineStore('chat', () => {
  const uiStore = useUIStore()
  const authStore = useAuthStore()
  const workspaceStore = useWorkspaceStore()

  const activeChat = ref<IChat | null>(null)
  const temporaryChatId = ref(crypto.randomUUID())

  function newChat() {
    temporaryChatId.value = crypto.randomUUID()

    activeChat.value = {
      id: temporaryChatId.value,
      userId: authStore.user!.id,
      threadId: '',
      workspaceId: workspaceStore.activeWorkspaceId!,
      name: 'Новый чат',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
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

  return { activeChat, temporaryChatId, newChat, selectChat, closeChat }
})
