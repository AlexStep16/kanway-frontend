<script setup lang="ts">
import AIBubble from '~/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import ConfirmationBubble from '~/components/Workspace/Main/Chat/Bubbles/ConfirmationBubble.vue'
import ChatTasksView from './Tasks/ChatTasksView.vue'
import ChatCategoriesView from './Categories/ChatCategoriesView.vue'
import ChatBoardsView from './Boards/ChatBoardsView.vue'
import ChatWorkspacesView from './Workspaces/ChatWorkspacesView.vue'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'

const { mutate: resolveAmbiguous, isPending: isResolvingAmbiguous } = useResolveAmbiguous()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()
const chatStore = useChatStore()

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

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

const selectedIds = ref<string[]>([])

function handleResolveAmbiguous() {
  resolveAmbiguous({
    payload: {
      ids: selectedIds.value,
      callId: props.message.content.callId,
    },
    chatId: chatStore.activeChatId ?? '',
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

const items = computed(
  () =>
    ((props.message.content?.ids ?? []) as any[]).map((id) => ({
      id,
    })) as any[],
)
</script>

<template>
  <AIBubble :isContentFullWidth="true">
    <template v-if="message.content.entityType === 'task'">
      <ConfirmationBubble :text="`Я нашел несколько подходящих задач. ${selectCountTitle}`" />

      <ChatTasksView
        :message="message"
        :items="items"
        :is-selectable="true"
        v-model:selectedIds="selectedIds"
        :min-select="message.content.minSelect"
        :max-select="message.content.maxSelect"
      />
    </template>
    <template v-else-if="message.content.entityType === 'category'">
      <ConfirmationBubble :text="`Я нашел несколько подходящих категорий. ${selectCountTitle}`" />

      <ChatCategoriesView
        :message="message"
        :items="items"
        :is-selectable="true"
        v-model:selectedIds="selectedIds"
        :min-select="message.content.minSelect"
        :max-select="message.content.maxSelect"
      />
    </template>
    <template v-else-if="message.content.entityType === 'board'">
      <ConfirmationBubble :text="`Я нашел несколько подходящих досок. ${selectCountTitle}`" />

      <ChatBoardsView
        :message="message"
        :items="items"
        :is-selectable="true"
        v-model:selectedIds="selectedIds"
        :min-select="message.content.minSelect"
        :max-select="message.content.maxSelect"
      />
    </template>
    <template v-else-if="message.content.entityType === 'workspace'">
      <ConfirmationBubble
        :text="`Я нашел несколько подходящих рабочих пространств. ${selectCountTitle}`"
      />

      <ChatWorkspacesView
        :message="message"
        :items="items"
        :is-selectable="true"
        v-model:selectedIds="selectedIds"
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
        <div
          class="flex items-center justify-center absolute"
          v-if="isResolvingAmbiguous"
        >
          <Spinner class="size-4" />
        </div>
        <span :class="{ 'opacity-0': isResolvingAmbiguous }"> Подтвердить </span>
      </button>
    </div>
  </AIBubble>
</template>
