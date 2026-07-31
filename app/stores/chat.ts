import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUIStore } from '~/stores/ui'
import type { IChat } from '~/interfaces/domain/IChat'
import { ModelsEnum } from '~/enums/ModelsEnum'

const generateUUID = () => {
  if (import.meta.client && typeof crypto !== 'undefined') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const useChatStore = defineStore('chat', () => {
  const uiStore = useUIStore()
  const boardStore = useBoardStore()

  const temporaryChatId = ref(generateUUID())
  const activeChatId = ref<string | null>(null)
  const modelType = ref<ModelsEnum>(ModelsEnum.GPT_5_4_MINI)
  const renamingChatSet = ref(new Set<string>())
  const aiInputMessage = ref<string>('')
  const demoChatApprovedTag = ref<string>('')
  const demoChatRejectedTag = ref<string>('')

  const isActiveChatTemporary = computed(() => activeChatId.value === temporaryChatId.value)
  const isChatRenaming = (chatId: string) => renamingChatSet.value.has(chatId)

  function newChat() {
    temporaryChatId.value = generateUUID()
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
  }

  function openFullChat() {
    boardStore.clearBoard()
    uiStore.selectBoard()
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
    openFullChat,
    startRenamingChat,
    stopRenamingChat,
  }
})
