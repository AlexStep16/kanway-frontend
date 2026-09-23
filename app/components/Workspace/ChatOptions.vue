<script setup lang="ts">
import { Trash } from '@lucide/vue'
import type { IChat } from '~/interfaces/domain/IChat'

const props = defineProps<{
  chat: IChat
  isMobile?: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat()

function handleDelete() {
  emits('close')

  deleteChat({
    id: props.chat.id,
    workspaceId: props.chat.workspaceId,
  })
}
</script>

<template>
  <DropdownMenuContent
    class="w-56 rounded-lg"
    :side="isMobile ? 'bottom' : 'right'"
    :align="isMobile ? 'end' : 'start'"
  >
    <template v-if="!toValue(isDeleting)">
      <Button
        variant="destructiveAlt"
        size="sm"
        class="w-full font-normal justify-start"
        @click="handleDelete"
      >
        <Trash />
        <span>Удалить</span>
      </Button>
    </template>
    <template v-else>
      <Button
        variant="destructiveAlt"
        size="sm"
        class="w-full font-normal justify-start"
        disabled
      >
        <Spinner />
        <span>Удаление</span>
      </Button>
    </template>
  </DropdownMenuContent>
</template>
