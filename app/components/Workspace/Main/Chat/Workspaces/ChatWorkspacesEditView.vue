<script setup lang="ts">
import ColumnsView from '~/components/Workspace/Main/ColumnsView.vue'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import type { IParent } from '~/interfaces/IParent'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'
import ChatWorkspaceEdit from '../EntityEdit/ChatWorkspaceEdit.vue'

export type BeforeAfterWorkspace = ISingleUpdate<IWorkspace> & {
  board: IParent
  workspace: IParent
  name: string
}

const props = defineProps<{
  before: BeforeAfterWorkspace[]
  after: BeforeAfterWorkspace[]
  isSelectable: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const containerRef = ref<HTMLElement | null>(null)

const selectedWorkspacesCount = computed(() => {
  return selectedIds.value.length
})

const hasCheckbox = computed(() => (workspace: IWorkspace) => {
  if (!props.isSelectable) return false
  if ((props.minSelect ?? 0) > 0 || (props.maxSelect ?? 0) > 0) {
    if ((props.minSelect ?? 0) > 0 && selectedWorkspacesCount.value < (props.minSelect ?? 0)) {
      return true
    }
    if ((props.maxSelect ?? 0) > 0 && selectedWorkspacesCount.value >= (props.maxSelect ?? 0)) {
      return selectedIds.value.includes(workspace.id)
    }
    return true
  }
})

const beforeAfterArray = computed(() => {
  const beforeMap = new Map(props.before.map((item) => [item.id, item]))
  const afterMap = new Map(props.after.map((item) => [item.id, item]))

  const allIds = new Set([...beforeMap.keys(), ...afterMap.keys()])
  const result: BeforeAfterWorkspace[][] = []

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
    ref="containerRef"
  >
    <ColumnsView
      :initialCountShown="10"
      :items="beforeAfterArray"
      :containerRef="containerRef"
    >
      <template v-slot:default="slotProps">
        <ChatWorkspaceEdit
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
