<script setup lang="ts">
import ColumnsView from '~/components/Workspace/Main/ColumnsView.vue'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import type { IParent } from '~/interfaces/IParent'
import ChatBoardEdit from '../EntityEdit/ChatBoardEdit.vue'
import type { IBoard } from '~/interfaces/domain/IBoard'

export type BeforeAfterBoard = ISingleUpdate<IBoard> & {
  board: IParent
  workspace: IParent
  name: string
}

const props = defineProps<{
  message: IChatMessage
  before: BeforeAfterBoard[]
  after: BeforeAfterBoard[]
  isSelectable: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

const selectedBoardsCount = computed(() => {
  return selectedIds.value.length
})

const hasCheckbox = computed(() => (board: IBoard) => {
  if (!props.isSelectable) return false
  if ((props.minSelect ?? 0) > 0 || (props.maxSelect ?? 0) > 0) {
    if ((props.minSelect ?? 0) > 0 && selectedBoardsCount.value < (props.minSelect ?? 0)) {
      return true
    }
    if ((props.maxSelect ?? 0) > 0 && selectedBoardsCount.value >= (props.maxSelect ?? 0)) {
      return selectedIds.value.includes(board.id)
    }
    return true
  }
})

const beforeAfterArray = computed(() => {
  const beforeMap = new Map(props.before.map((item) => [item.id, item]))
  const afterMap = new Map(props.after.map((item) => [item.id, item]))

  const allIds = new Set([...beforeMap.keys(), ...afterMap.keys()])
  const result: BeforeAfterBoard[][] = []

  allIds.forEach((id) => {
    if (beforeMap.has(id) && afterMap.has(id)) {
      result.push([beforeMap.get(id)!, afterMap.get(id)!])
    } else if (beforeMap.has(id)) {
      result.push([beforeMap.get(id)!, null as any])
    } else if (afterMap.has(id)) {
      result.push([null as any, afterMap.get(id)!])
    }
  })

  return result
})
</script>

<template>
  <div
    class="flex gap-2 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement | null
      }
    "
  >
    <ColumnsView
      :initialCountShown="10"
      :items="beforeAfterArray"
      :containerRef="messagesContainerRefMap[message.id]!"
    >
      <template v-slot:default="slotProps">
        <ChatBoardEdit
          v-for="[before, after] in slotProps.data"
          :key="before?.id ?? after?.id"
          :before="before"
          :after="after"
          :isSelectable="isSelectable"
          :hasCheckbox="hasCheckbox(before ?? after)"
          v-model:selectedIds="selectedIds"
        />
      </template>
    </ColumnsView>
  </div>
</template>
