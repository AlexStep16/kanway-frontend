import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUIStore } from '~/stores/ui'
import type { IChat } from '~/interfaces/domain/IChat'
import { ModelsEnum } from '~/enums/ModelsEnum'

export const useChatStore = defineStore('chat', () => {
  const uiStore = useUIStore()

  const temporaryChatId = ref(window.crypto.randomUUID())
  const activeChatId = ref<string | null>(null)
  const modelType = ref<ModelsEnum>(ModelsEnum.GPT_5_4_MINI)
  const renamingChatSet = ref(new Set<string>())
  const aiInputMessage = ref<string>('')
  const demoChatApprovedTag = ref<string>('')
  const demoChatRejectedTag = ref<string>('')

  const isActiveChatTemporary = computed(() => activeChatId.value === temporaryChatId.value)
  const isChatRenaming = (chatId: string) => renamingChatSet.value.has(chatId)

  function newChat() {
    temporaryChatId.value = window.crypto.randomUUID()
    activeChatId.value = temporaryChatId.value

    uiStore.isChatOpen = true
  }

  function selectChat(chat: IChat) {
    activeChatId.value = chat.id
    uiStore.isChatOpen = true

    const { $queryClient } = useNuxtApp()

    $queryClient.invalidateQueries({ queryKey: chatMessageKeys.byChat(chat.id) })
  }

  function closeChat() {
    activeChatId.value = temporaryChatId.value
    uiStore.isChatOpen = false

    if (uiStore.isChatTabSelected) {
      uiStore.selectBoard()
    }
  }

  function startRenamingChat(chatId: string) {
    renamingChatSet.value.add(chatId)
  }

  function stopRenamingChat(chatId: string) {
    renamingChatSet.value.delete(chatId)
  }

  return {
    activeChatId,
    modelType,
    temporaryChatId,
    isActiveChatTemporary,
    aiInputMessage,
    demoChatApprovedTag,
    demoChatRejectedTag,
    isChatRenaming,
    newChat,
    selectChat,
    closeChat,
    startRenamingChat,
    stopRenamingChat,
  }
})
