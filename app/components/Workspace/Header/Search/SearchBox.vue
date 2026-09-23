<script setup lang="ts">
import Tabs from '~/enums/TabsEnum'
import type { ITaskState } from '~/stores/interfaces/ITaskState'

const props = defineProps<{
  variant: 'dropdown' | 'static'
}>()

const uiStore = useUIStore()
const boardStore = useBoardStore()
const searchModel = ref('')
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const activeBoardId = computed(() => boardStore.activeBoardId)

const searchPlaceholder = computed(() => {
  if (uiStore.currentTab === Tabs.Archive) return 'Поиск в архиве...'
  return 'Поиск...'
})

const isDropdownOpen = computed(() => {
  return props.variant === 'dropdown' && searchModel.value.length > 0 && isFocused.value
})

const { tasks, columns, isEmpty } = useBoardSearch(searchModel, activeBoardId)

const connectExposed = (exposed: any) => {
  if (exposed?.inputRef) inputRef.value = exposed.inputRef
}

const handleInteractOutside = (event: Event) => {
  const target = event.target as HTMLElement

  if (target === inputRef.value) {
    return
  }
  isFocused.value = false
}

const handleSelectTask = (task: ITaskState) => {
  uiStore.openTaskToEdit(task)

  if (props.variant === 'dropdown') {
    searchModel.value = ''
    isFocused.value = false
  }
}
</script>

<template>
  <div :class="['flex flex-col min-h-0', variant === 'static' ? 'h-full' : '']">
    <Popover :open="isDropdownOpen">
      <PopoverAnchor as-child>
        <div :class="variant === 'static' ? 'p-3' : ''">
          <SearchInput
            :ref="connectExposed"
            v-model="searchModel"
            @focus="isFocused = true"
            @clear="searchModel = ''"
            :placeholder="searchPlaceholder"
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        v-if="variant === 'dropdown'"
        side="bottom"
        :align="'start'"
        class="w-(--radix-popover-trigger-width) max-w-90 p-2 shadow-xl rounded-xl border bg-white z-100"
        @open-auto-focus.prevent
        @interact-outside="handleInteractOutside"
      >
        <div class="max-h-125 overflow-y-auto custom-scrollbar">
          <SearchResultsList
            :tasks="tasks"
            :columns="columns"
            :is-empty="isEmpty"
            @selectTask="handleSelectTask"
          />
        </div>
      </PopoverContent>
    </Popover>

    <div
      v-if="variant === 'static' && searchModel.length > 0"
      class="flex-1 min-h-0 overflow-y-auto p-2"
    >
      <SearchResultsList
        :tasks="tasks"
        :columns="columns"
        :is-empty="isEmpty"
        @selectTask="handleSelectTask"
      />
    </div>
  </div>
</template>
