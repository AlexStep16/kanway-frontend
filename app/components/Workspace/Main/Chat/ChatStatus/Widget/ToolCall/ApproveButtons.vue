<script lang="ts" setup>
import { Check, X } from '@lucide/vue'

const props = defineProps<{
  toolId: string
  chatId: string
  threadId: string
  statusLogId: string
  isDemo?: boolean
}>()

const { mutate: approveToolCall } = useApproveTool()

const chatStore = useChatStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

function approve() {
  if (props.isDemo) {
    chatStore.demoChatApprovedTag = Math.random().toString(36).substring(2, 15)
    return
  }

  approveToolCall({
    payload: {
      toolId: props.toolId,
      chatId: props.chatId,
      statusLogId: props.statusLogId,
      threadId: props.threadId,
      isConfirmed: true,
      isRejected: false,
    },
    boardId: activeBoardId.value,
    workspaceId: activeWorkspaceId.value,
  })
}

function reject() {
  if (props.isDemo) {
    chatStore.demoChatRejectedTag = Math.random().toString(36).substring(2, 15)
    return
  }

  approveToolCall({
    payload: {
      toolId: props.toolId,
      chatId: props.chatId,
      statusLogId: props.statusLogId,
      threadId: props.threadId,
      isConfirmed: false,
      isRejected: true,
    },
    boardId: activeBoardId.value,
    workspaceId: activeWorkspaceId.value,
  })
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <Button
      variant="outlinePrimary"
      size="xs"
      class="text-muted-foreground cursor-pointer"
      @click="approve"
    >
      <Check class="size-3" />
      <span>Подтвердить</span>
    </Button>
    <Button
      variant="outlineDestructive"
      size="xs"
      class="text-muted-foreground cursor-pointer"
      @click="reject"
    >
      <X class="size-3" />
      <span>Отменить</span>
    </Button>
  </div>
</template>
