<script setup lang="ts">
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'
import NameChange from './Changes/NameChange.vue'
import SelectCheckbox from '../SelectCheckbox.vue'
import FavoriteChange from './Changes/FavoriteChange.vue'
import WorkspaceColorChange from './Changes/WorkspaceColorChange.vue'

const props = defineProps<{
  before: ISingleUpdate<IWorkspace> & {
    name: string
  }
  after: ISingleUpdate<IWorkspace> & {
    name: string
  }
  isSelectable: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const baseBlockBeforeClasses = 'text-red-500 bg-red-200 py-1 px-2 self-start rounded-sm'
const baseBlockAfterClasses = 'text-green-600 bg-green-200 py-1 px-2 self-start rounded-sm'

function handleToggleSelect(id: string) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id)
  } else {
    selectedIds.value.push(id)
  }
}

const isSelected = computed(() => selectedIds.value.includes(props.after.id || props.before.id))
</script>

<template>
  <div
    class="flex flex-col shrink-0 shadow-sm rounded-md min-w-60 cursor-pointer border border-gray-200 hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
  >
    <div class="flex flex-col gap-y-2 p-3 group/task relative">
      <div class="flex items-start justify-between gap-x-2">
        <NameChange
          :before="before"
          :after="after"
          :baseBlockBeforeClasses="baseBlockBeforeClasses"
          :baseBlockAfterClasses="baseBlockAfterClasses"
        />
        <SelectCheckbox
          :is-checked="isSelected"
          @toggle-select="handleToggleSelect(props.after.id || props.before.id)"
          v-if="isSelectable && selectedIds"
        />
      </div>
      <!-- Цвет -->
      <WorkspaceColorChange
        :before="before"
        :after="after"
        :baseBlockBeforeClasses="baseBlockBeforeClasses"
        :baseBlockAfterClasses="baseBlockAfterClasses"
      />
      <!-- Избранное -->
      <FavoriteChange
        :before="before"
        :after="after"
        :baseBlockBeforeClasses="baseBlockBeforeClasses"
        :baseBlockAfterClasses="baseBlockAfterClasses"
      />
      <slot />
    </div>
  </div>
</template>
