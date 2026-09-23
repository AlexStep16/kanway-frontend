<script setup lang="ts">
import MoveDropdownButton from '~/components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import type { IParent } from '~/interfaces/IParent'
import type { ITaskState } from '~/stores/interfaces/ITaskState'

const props = defineProps<{
  task: ITaskState
}>()

const emit = defineEmits<{
  (
    e: 'move',
    data: {
      newColumnId: string
      newBoardId: string
      workspace: IParent
      board: IParent
      column: IParent
    },
  ): void
}>()

const isPopoverOpen = ref(false)
const isWorkspacesSelectOpen = ref(false)
const isBoardsSelectOpen = ref(false)
const isColumnsSelectOpen = ref(false)

const selectedWorkspaceId = ref('')
const selectedBoardId = ref<string | null>(null)
const selectedColumnId = ref<string | null>(null)

const { data: workspacesData } = useWorkspaces()
const { data: boardsData, isFetching: isBoardsLoading } = useBoards(
  computed(() => selectedWorkspaceId.value),
)
const { data: columnsData, isFetching: isColumnsLoading } = useColumns(
  computed(() => selectedBoardId.value),
)

const workspaces = computed(() => workspacesData.value || [])
const boards = computed(() => boardsData.value || [])
const columns = computed(() => columnsData.value || [])

watch(
  () => props.task,
  (task) => {
    selectedWorkspaceId.value = task.workspace?.id || ''
    selectedBoardId.value = task.board?.id || null
    selectedColumnId.value = task.column?.id || null
  },
  { immediate: true },
)

watch(selectedWorkspaceId, (newId, oldId) => {
  if (newId !== oldId) {
    if (props.task.workspace?.id === newId) {
      selectedBoardId.value = props.task.board?.id || null
      selectedColumnId.value = props.task.column?.id || null
    } else {
      selectedBoardId.value = null
      selectedColumnId.value = null
    }
  }
})

watch(selectedBoardId, (newId, oldId) => {
  if (newId !== oldId) {
    if (props.task.board?.id === newId) {
      selectedColumnId.value = props.task.column?.id || null
    } else {
      selectedColumnId.value = null
    }
  }
})

const isMoveDisabled = computed(() => {
  return selectedColumnId.value === props.task.column?.id || !selectedColumnId.value
})

const buttonTitle = computed(() => props.task.column?.name || 'Без колонки')

function handleMove() {
  if (!selectedColumnId.value || !selectedBoardId.value) return

  const workspace = workspaces.value.find((item) => item.id === selectedWorkspaceId.value)
  const board = boards.value.find((item) => item.id === selectedBoardId.value)
  const column = columns.value.find((item) => item.id === selectedColumnId.value)

  if (!workspace || !board || !column) return

  emit('move', {
    newColumnId: selectedColumnId.value,
    newBoardId: selectedBoardId.value,
    workspace: {
      id: workspace.id,
      name: workspace.name,
    },
    board: {
      id: board.id,
      name: board.name,
    },
    column: {
      id: column.id,
      name: column.name,
    },
  })
  isPopoverOpen.value = false
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <MoveDropdownButton :title="buttonTitle">
        <slot />
      </MoveDropdownButton>
    </PopoverTrigger>

    <PopoverContent
      class="w-64 p-3"
      align="start"
    >
      <div class="flex flex-col gap-y-2">
        <div class="flex flex-col gap-y-1.5">
          <label class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider"
            >Пространство</label
          >
          <Select
            v-model="selectedWorkspaceId"
            v-model:open="isWorkspacesSelectOpen"
          >
            <SelectTrigger
              class="h-8 text-custom-sm"
              :is-open="isWorkspacesSelectOpen"
            >
              <SelectValue placeholder="Выберите пространство..." />
            </SelectTrigger>
            <SelectContent :body-lock="false">
              <SelectItem
                v-for="ws in workspaces"
                :key="ws.id"
                class="text-custom-sm"
                :value="ws.id"
              >
                {{ ws.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-y-1.5 relative">
          <label class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider"
            >Доска</label
          >

          <Skeleton
            v-if="isBoardsLoading"
            class="h-8 w-full rounded-md"
          />

          <Select
            v-else
            v-model="selectedBoardId"
            v-model:open="isBoardsSelectOpen"
            :disabled="boards.length === 0"
          >
            <SelectTrigger
              class="h-8 text-custom-sm"
              :is-open="isBoardsSelectOpen"
            >
              <SelectValue
                :placeholder="boards.length === 0 ? 'Нет досок...' : 'Выберите доску...'"
              />
            </SelectTrigger>
            <SelectContent :body-lock="false">
              <SelectItem
                v-for="b in boards"
                class="text-custom-sm"
                :key="b.id"
                :value="b.id"
              >
                {{ b.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-y-1.5 relative">
          <label class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider"
            >Колонка</label
          >

          <Skeleton
            v-if="isColumnsLoading"
            class="h-8 w-full rounded-md"
          />

          <Select
            v-else
            v-model="selectedColumnId"
            v-model:open="isColumnsSelectOpen"
            :disabled="columns.length === 0"
          >
            <SelectTrigger
              class="h-8 text-custom-sm"
              :is-open="isColumnsSelectOpen"
            >
              <SelectValue
                :placeholder="columns.length === 0 ? 'Нет колонок...' : 'Выберите колонку...'"
              />
            </SelectTrigger>
            <SelectContent :body-lock="false">
              <SelectItem
                v-for="c in columns"
                :key="c.id"
                class="text-custom-sm"
                :value="c.id"
              >
                {{ c.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          class="w-full text-xs h-8"
          :disabled="isMoveDisabled || isBoardsLoading || isColumnsLoading"
          @click="handleMove"
        >
          Переместить
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
