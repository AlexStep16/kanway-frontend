<script setup lang="ts">
import Spinner from '@components/Loader/Spinner.vue'
import { useChatStore } from '@/stores/chat'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import Confirmation from '@components/Workspace/Main/Chat/Bubbles/Confirmation.vue'
import ChatTasksView from './Tasks/ChatTasksView.vue'
import ChatCategoriesView from './Categories/ChatCategoriesView.vue'
import ChatBoardsView from './Boards/ChatBoardsView.vue'
import ChatWorkspacesView from './Workspaces/ChatWorkspacesView.vue'
import { useResolveAmbiguous } from '@/composables/chat/mutations/useResolveAmbiguous'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoardStore } from '@/stores/board'
import { computed, ref } from 'vue'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

const { mutate: resolveAmbiguous, isPending: isResolvingAmbiguous } = useResolveAmbiguous()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()
const chatStore = useChatStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const props = defineProps<{
  message: Omit<IChatMessage, 'content'> & {
    content: {
      callId: string
      entityType: 'task' | 'category' | 'board' | 'workspace'
      ids: string[]
      minSelect: number
      maxSelect: number
    }
  }
}>()

const selectedMap = ref<{ id: string; isSelected: boolean }[]>([])

props.message.content.ids.forEach((id) => {
  selectedMap.value.push({
    id,
    isSelected: false,
  })
})

function handleResolveAmbiguous() {
  const ids = selectedMap.value.filter((item) => item.isSelected).map((item) => item.id)

  resolveAmbiguous({
    payload: {
      ids,
      callId: props.message.content.callId,
    },
    chatId: chatStore.activeChat?.id ?? '',
    chatMessageId: props.message.id,
    boardId: activeBoardId.value || '',
    workspaceId: activeWorkspaceId.value || '',
  })
}

const selectCountTitle = computed(() => {
  if (props.message.content.minSelect === props.message.content.maxSelect) {
    return `Выберите ${props.message.content.minSelect}`
  }
  if (props.message.content.minSelect > 0 && props.message.content.maxSelect > 0) {
    return `Выберите от ${props.message.content.minSelect} до ${props.message.content.maxSelect}`
  }

  return 'Выберите подходящие варианты'
})

const items = computed(() => selectedMap.value as any)
</script>

<template>
  <AIBubble :isContentFullWidth="true">
    <template v-if="message.content.entityType === 'task'">
      <Confirmation :text="`Я нашел несколько подходящих задач. ${selectCountTitle}`" />

      <ChatTasksView
        :message="message"
        :items="items"
        :is-temporary="false"
        :is-selectable="true"
        :min-select="message.content.minSelect"
        :max-select="message.content.maxSelect"
      />
    </template>
    <template v-else-if="message.content.entityType === 'category'">
      <Confirmation :text="`Я нашел несколько подходящих категорий. ${selectCountTitle}`" />

      <ChatCategoriesView
        :message="message"
        :items="items"
        :is-temporary="false"
        :is-selectable="true"
        :min-select="message.content.minSelect"
        :max-select="message.content.maxSelect"
      />
    </template>
    <template v-else-if="message.content.entityType === 'board'">
      <Confirmation :text="`Я нашел несколько подходящих досок. ${selectCountTitle}`" />

      <ChatBoardsView
        :message="message"
        :items="items"
        :is-temporary="false"
        :is-selectable="true"
        :min-select="message.content.minSelect"
        :max-select="message.content.maxSelect"
      />
    </template>
    <template v-else-if="message.content.entityType === 'workspace'">
      <Confirmation
        :text="`Я нашел несколько подходящих рабочих пространств. ${selectCountTitle}`"
      />

      <ChatWorkspacesView
        :message="message"
        :items="items"
        :is-temporary="false"
        :is-selectable="true"
        :min-select="message.content.minSelect"
        :max-select="message.content.maxSelect"
      />
    </template>

    <div class="flex gap-x-2 max-w-lg mt-3 pt-3 border-t border-gray-200">
      <button
        type="button"
        class="flex items-center justify-center text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity duration-100 relative disabled:opacity-50 disabled:pointer-events-none"
        :disabled="isResolvingAmbiguous"
        @click="handleResolveAmbiguous()"
      >
        <div class="flex items-center justify-center absolute" v-if="isResolvingAmbiguous">
          <Spinner class="size-4" />
        </div>
        <span> Подтвердить </span>
      </button>
    </div>
  </AIBubble>
</template>
