<script setup lang="ts">
import Title from './Title.vue'
import { useChatStore } from '~/stores/chat'
import { MessageCircle } from 'lucide-vue-next'

const { mutate: updateChat, isPending: isUpdatingChat } = useUpdateChat()

const chatStore = useChatStore()
const workspaceStore = useWorkspaceStore()

const activeChatId = computed(() => chatStore.activeChatId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)
const isChatRenaming = computed(() => {
  if (!activeChatId.value) return false
  return chatStore.isChatRenaming(activeChatId.value)
})

const { data: activeChat, isPending: isChatLoading } = useChat(activeChatId, activeWorkspaceId)

const activeChatName = computed(() => activeChat.value?.name || 'Без названия')

function handleUpdateChatName(newName: string) {
  if (activeChatId.value) {
    updateChat({
      id: activeChatId.value,
      payload: { name: newName },
    })
  }
}
</script>

<template>
  <Title
    :initialName="activeChatName"
    :isLoading="isUpdatingChat"
    @updateName="handleUpdateChatName"
    v-if="activeChat && !chatStore.isActiveChatTemporary && !isChatLoading"
  >
    <MessageCircle
      class="size-4 text-zinc-500 dark:text-zinc-400"
      v-if="!isChatRenaming"
    />
    <Spinner
      class="size-4 text-zinc-500 dark:text-zinc-400"
      v-else
    />
  </Title>
  <div
    class="flex items-center gap-2"
    v-else-if="isChatLoading"
  >
    <Skeleton class="w-24 h-5" />
  </div>
  <div
    class="px-1.5 flex items-center gap-2"
    v-else
  >
    <MessageCircle class="size-4" />
    <span class="text-sm font-medium"> Новый чат </span>
  </div>
</template>
