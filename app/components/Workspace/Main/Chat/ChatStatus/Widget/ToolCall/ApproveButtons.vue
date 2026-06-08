<script lang="ts" setup>
import { Check, X } from 'lucide-vue-next'

const props = defineProps<{
  toolId: string
  chatId: string
  threadId: string
  statusLogId: string
}>()

const { mutate: approveToolCall } = useApproveTool()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

function approve() {
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
