<script setup lang="ts">
import { Pen, Trash } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toValue } from 'vue'
import Spinner from '../ui/spinner/Spinner.vue'
import { useUIStore } from '@/stores/ui'
import { useDeleteChat } from '@/composables/chat/mutations/useDeleteChat'
import { IChat } from '@/interfaces/domain/IChat'

const props = defineProps<{
  chat: IChat
  isMobile?: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const uiStore = useUIStore()

const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat()

function handleEdit() {
  //uiStore.openChatToEdit(props.chat)
}

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
    <DropdownMenuItem @click="handleEdit">
      <Pen />
      <span>Редактировать</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
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
      <Button variant="destructiveAlt" size="sm" class="w-full font-normal justify-start" disabled>
        <Spinner />
        <span>Удаление</span>
      </Button>
    </template>
  </DropdownMenuContent>
</template>
