<script setup lang="ts">
import { computed } from 'vue'
import Options from '@/components/Options/Options.vue'
import { storeToRefs } from 'pinia'
import SidebarBaseItem from './SidebarBaseItem.vue'
import { useChatStore } from '@/stores/chat'
import { useChatMutationStatus } from '@/composables/chat/mutations/useChatMutationStatus'
import ChatModel from '@/models/ChatModel'
import { useUIStore } from '@/stores/ui'
import { useDeleteChat } from '@/composables/chat/mutations/useDeleteChat'

const chatStore = useChatStore()
const uiStore = useUIStore()

const { activeChat } = storeToRefs(chatStore)

const { mutate: deleteChat } = useDeleteChat()

const props = defineProps<{
  item: ChatModel
}>()

defineEmits<{
  (e: 'select'): void
}>()

const chatStatus = useChatMutationStatus(computed(() => props.item.id))

const selected = computed(() => {
  return props.item.id === activeChat.value?.id && uiStore.isChatOpen
})

function handleDelete() {
  deleteChat({
    id: props.item.id,
    workspaceId: props.item.workspaceId,
  })
}
</script>

<template>
  <SidebarBaseItem :name="item.name" :selected="selected" @select="$emit('select')">
    <template #options>
      <Options
        :options="{
          delete: true,
        }"
        :status="chatStatus"
        :item="item"
        class="absolute right-2.5"
        groupName="sidebar-item"
        :hoverClass="selected ? 'lg:hover:bg-blue-200' : 'lg:hover:bg-gray-200'"
        @delete="handleDelete"
      ></Options>
    </template>
  </SidebarBaseItem>
</template>
