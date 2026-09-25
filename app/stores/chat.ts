import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useUIStore } from '~/stores/ui'
import type { IChat } from '~/interfaces/domain/IChat'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { ProModelsEnum } from '~/enums/ProModelsEnum'
import { useWorkspaceStore } from '~/stores/workspace'

const MODEL_TYPE_STORAGE_KEY = 'chatModelType'
const SELECTED_CHAT_ID_KEY = 'selectedChatId'
const SELECTED_CHAT_WORKSPACE_ID_KEY = 'selectedChatWorkspaceId'
const CHAT_OPEN_KEY = 'chatIsOpen'

const generateUUID = () => {
  if (import.meta.client && typeof crypto !== 'undefined') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function getStoredModelType(): ModelsEnum {
  if (import.meta.client) {
    const stored = localStorage.getItem(MODEL_TYPE_STORAGE_KEY)
    const { data: user } = useUser()

    if (
      stored &&
      user.value?.subscriptionId === SubscriptionPlanEnum.Basic &&
      Object.values(ProModelsEnum).includes(stored as ProModelsEnum)
    ) {
      return ModelsEnum.GPT_5_6_LUNA
    }

    if (stored && Object.values(ModelsEnum).includes(stored as ModelsEnum)) {
      return stored as ModelsEnum
    }
  }
  return ModelsEnum.GPT_5_6_LUNA
}

export const useChatStore = defineStore('chat', () => {
  const uiStore = useUIStore()
  const workspaceStore = useWorkspaceStore()
  const boardStore = useBoardStore()

  const temporaryChatId = ref(generateUUID())
  const sessionRestored = ref(false)
  const activeChatId = ref<string | null>(null)
  const modelType = ref<ModelsEnum>(getStoredModelType())
  const renamingChatSet = ref(new Set<string>())
  const aiInputMessage = ref<string>('')
  const demoChatApprovedTag = ref<string>('')
  const demoChatRejectedTag = ref<string>('')

  const isActiveChatTemporary = computed(() => activeChatId.value === temporaryChatId.value)
  const isChatRenaming = (chatId: string) => renamingChatSet.value.has(chatId)

  watch(modelType, (value) => {
    if (import.meta.client) {
      localStorage.setItem(MODEL_TYPE_STORAGE_KEY, value)
    }
  })

  function newChat() {
    temporaryChatId.value = generateUUID()
    activeChatId.value = temporaryChatId.value

    uiStore.isChatOpen = true

    if (!boardStore.activeBoardId) {
      uiStore.isChatFullscreen = true
    }

    if (import.meta.client) {
      localStorage.removeItem(SELECTED_CHAT_ID_KEY)
      localStorage.removeItem(SELECTED_CHAT_WORKSPACE_ID_KEY)
      localStorage.removeItem(CHAT_OPEN_KEY)
    }
  }

  function persistActiveChat(chatId: string) {
    if (import.meta.client) {
      localStorage.setItem(SELECTED_CHAT_ID_KEY, chatId)
      localStorage.setItem(SELECTED_CHAT_WORKSPACE_ID_KEY, workspaceStore.activeWorkspaceId ?? '')
      localStorage.setItem(CHAT_OPEN_KEY, 'true')
    }
  }

  function selectChat(chat: IChat) {
    activeChatId.value = chat.id
    uiStore.isChatOpen = true

    if (!boardStore.activeBoardId) {
      uiStore.isChatFullscreen = true
    }

    uiStore.selectBoard()

    persistActiveChat(chat.id)

    const { $queryClient } = useNuxtApp()

    $queryClient.invalidateQueries({ queryKey: chatMessageKeys.byChat(chat.id) })
  }

  function closeChat() {
    activeChatId.value = temporaryChatId.value
    uiStore.isChatOpen = false
    uiStore.closeChatFullscreen()

    if (import.meta.client) {
      localStorage.removeItem(SELECTED_CHAT_ID_KEY)
      localStorage.removeItem(SELECTED_CHAT_WORKSPACE_ID_KEY)
      localStorage.setItem(CHAT_OPEN_KEY, 'false')
    }
  }

  function restoreSession() {
    if (!import.meta.client || sessionRestored.value) return
    sessionRestored.value = true

    if (window.matchMedia('(max-width: 768px)').matches) return

    const chatId = localStorage.getItem(SELECTED_CHAT_ID_KEY)
    const wasOpen = localStorage.getItem(CHAT_OPEN_KEY) === 'true'
    const isFirstTime = !wasOpen && localStorage.getItem(CHAT_OPEN_KEY) !== 'false'
    const workspaceId = localStorage.getItem(SELECTED_CHAT_WORKSPACE_ID_KEY)

    if (isFirstTime) {
      uiStore.isChatOpen = true
      activeChatId.value = temporaryChatId.value
    }
    if (!chatId || !wasOpen) return

    if (
      workspaceId &&
      workspaceStore.activeWorkspaceId &&
      workspaceId !== workspaceStore.activeWorkspaceId
    ) {
      return
    }

    activeChatId.value = chatId
    uiStore.isChatOpen = true

    const { $queryClient } = useNuxtApp()
    $queryClient.invalidateQueries({ queryKey: chatMessageKeys.byChat(chatId) })
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
    persistActiveChat,
    newChat,
    selectChat,
    closeChat,
    restoreSession,
    startRenamingChat,
    stopRenamingChat,
  }
})
