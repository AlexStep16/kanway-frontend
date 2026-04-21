<script setup lang="ts">
import { computed } from 'vue'
import Title from './Title.vue'
import { useChatStore } from '@/stores/chat'
import { MessageCircle } from 'lucide-vue-next'
import { useUpdateChat } from '@/composables/chat/mutations/useUpdateChat'
import { useChat } from '@/composables/chat/queries/useChat'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '@/stores/workspace'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const { mutate: updateChat, isPending: isUpdatingChat } = useUpdateChat()

const chatStore = useChatStore()
const workspaceStore = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)
const { activeChatId } = storeToRefs(chatStore)

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
    <MessageCircle class="size-4" />
  </Title>
  <div class="flex items-center gap-2" v-else-if="isChatLoading">
    <Skeleton class="w-24 h-5" />
  </div>
  <div class="px-1.5 flex items-center gap-2" v-else>
    <MessageCircle class="size-4" />
    <span class="text-sm font-medium"> Новый чат </span>
  </div>
</template>
