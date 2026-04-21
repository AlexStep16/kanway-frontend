import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUIStore } from '@stores/ui'
import { IChat } from '@/interfaces/domain/IChat'
import { queryClient } from '@/plugins/queryClient'
import { chatMessageKeys } from '@/keys'
import { ModelsEnum } from '@/enums/ModelsEnum'

export const useChatStore = defineStore('chat', () => {
  const uiStore = useUIStore()

  const temporaryChatId = ref(crypto.randomUUID())
  const activeChatId = ref<string | null>(null)
  const modelType = ref<ModelsEnum>(ModelsEnum.KANWAY_LITE)

  const isActiveChatTemporary = computed(() => activeChatId.value === temporaryChatId.value)

  function newChat() {
    temporaryChatId.value = crypto.randomUUID()
    activeChatId.value = temporaryChatId.value

    uiStore.isChatOpen = true
  }

  function selectChat(chat: IChat) {
    activeChatId.value = chat.id
    uiStore.isChatOpen = true

    queryClient.invalidateQueries({ queryKey: chatMessageKeys.byChat(chat.id) })
  }

  function closeChat() {
    activeChatId.value = null
    uiStore.isChatOpen = false
  }

  return {
    activeChatId,
    modelType,
    temporaryChatId,
    isActiveChatTemporary,
    newChat,
    selectChat,
    closeChat,
  }
})
