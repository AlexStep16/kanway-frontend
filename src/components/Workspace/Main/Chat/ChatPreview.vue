<script setup lang="ts">
import ChatTasksView from './ChatTasks/ChatTasksView.vue'
import ChatBoardCardView from './ChatBoards/ChatBoardCardView.vue'
import ChatCategoryCardView from './ChatCategories/ChatCategoryCardView.vue'
import ChatWorkspaceCardView from './ChatWorkspaces/ChatWorkspaceCardView.vue'
import Spinner from '@components/Loader/Spinner.vue'
import Confirmation from '@components/Workspace/Main/Chat/Bubbles/Confirmation.vue'
import { Check } from 'lucide-vue-next'
import { useApproveTool } from '@/composables/chat/mutations/useApproveTool'
import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import { IToolApproveMessage } from '@/interfaces/IToolApproveMessage'

const { mutate: approveToolCall, isPending: isToolCallApproving } = useApproveTool()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()
const chatStore = useChatStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const props = defineProps<{
  message: IToolApproveMessage
}>()

function handleApproveToolCall(
  toolCallId: string,
  chatMessageId: string,
  decision: 'confirm' | 'cancel',
) {
  approveToolCall({
    payload: {
      toolCallId,
      chatMessageId,
      content: props.message.content,
      boardId: activeBoardId.value || '',
      isConfirmed: decision === 'confirm',
      isCancelled: decision === 'cancel',
      workspaceId: activeWorkspaceId.value || '',
    },
    message: props.message,
    chatId: chatStore.activeChat?.id ?? '',
  })
}

function isToolCallApproved(toolCall: any) {
  return toolCall.isConfirmed || toolCall.isCancelled
}
</script>

<template>
  <AIBubble v-for="content in message.content" :key="content.callId" :isContentFullWidth="true">
    <Confirmation :text="content.title" :changes="content.args.changes" />

    <template v-if="content.entityType && content.context">
      <ChatTasksView
        :message="message"
        :tasks="content.context"
        v-if="content.entityType === 'task'"
      />
      <ChatCategoryCardView
        :message="message"
        :entities="content.context"
        v-else-if="content.entityType === 'category'"
      />
      <ChatBoardCardView
        :message="message"
        :entities="content.context"
        v-else-if="content.entityType === 'board'"
      />
      <ChatWorkspaceCardView
        :message="message"
        :entities="content.context"
        v-else-if="content.entityType === 'workspace'"
      />
    </template>

    <div
      class="flex gap-x-2 max-w-lg mt-3 pt-3 border-t border-gray-200"
      v-if="!isToolCallApproved(content)"
    >
      <button
        type="button"
        class="flex items-center justify-center text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity duration-100 relative"
        @click="handleApproveToolCall(content.callId, message.id, 'confirm')"
      >
        <div class="flex items-center justify-center absolute" v-if="isToolCallApproving">
          <Spinner class="size-4" />
        </div>
        <span :class="{ 'opacity-0': isToolCallApproving }"> Подтвердить </span>
      </button>

      <button
        type="button"
        class="flex items-center justify-center text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100 relative"
        @click="handleApproveToolCall(content.callId, message.id, 'cancel')"
      >
        <div class="flex items-center justify-center absolute" v-if="isToolCallApproving">
          <Spinner class="size-4" />
        </div>
        <span :class="{ 'opacity-0': isToolCallApproving }"> Отменить </span>
      </button>
    </div>

    <div v-if="content.isConfirmed" class="text-green-600 flex items-center gap-x-2">
      <Check class="size-4" />
      <span class="text-xs font-medium">Выполнение запланировано.</span>
    </div>
    <div v-else-if="content.isCancelled" class="text-red-500 flex items-center gap-x-2">
      <Check class="size-4" />
      <span class="text-xs font-medium">Выполнение отменено.</span>
    </div>
  </AIBubble>
</template>
