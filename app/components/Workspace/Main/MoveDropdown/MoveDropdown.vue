<script setup lang="ts">
import MoveDropdownButton from '~/components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import { EntityType } from '~/enums/EntityType'

const props = defineProps<{
  entity: any
  type: EntityType
}>()

const emit = defineEmits<{
  (
    e: 'move',
    data: {
      id: string
      newCategoryId: string | null
      newBoardId: string | null
      newWorkspaceId: string
    },
  ): void
}>()

const isPopoverOpen = ref(false)
const isWorkspacesSelectOpen = ref(false)
const isBoardsSelectOpen = ref(false)
const isCategoriesSelectOpen = ref(false)

const selectedWorkspaceId = ref<string>(props.entity.workspace?.id || '')
const selectedBoardId = ref<string | null>(props.entity.board?.id || null)
const selectedCategoryId = ref<string | null>(props.entity.category?.id || null)

const { data: workspacesData } = useWorkspaces()
const { data: boardsData, isFetching: isBoardsLoading } = useBoards(
  computed(() => selectedWorkspaceId.value),
)
const { data: categoriesData, isFetching: isCategoriesLoading } = useCategories(
  computed(() => selectedBoardId.value),
)

const workspaces = computed(() => workspacesData.value || [])
const boards = computed(() => boardsData.value || [])
const categories = computed(() => categoriesData.value || [])

watch(selectedWorkspaceId, (newId, oldId) => {
  if (newId !== oldId) {
    if (props.entity.workspace?.id === newId) {
      selectedBoardId.value = props.entity.board?.id || null
      selectedCategoryId.value = props.entity.category?.id || null
    } else {
      selectedBoardId.value = null
      selectedCategoryId.value = null
    }
  }
})

watch(selectedBoardId, (newId, oldId) => {
  if (newId !== oldId) {
    if (props.entity.board?.id === newId) {
      selectedCategoryId.value = props.entity.category?.id || null
    } else {
      selectedCategoryId.value = null
    }
  }
})

const isMoveDisabled = computed(() => {
  if (props.type === EntityType.Board)
    return selectedWorkspaceId.value === props.entity.workspace?.id || !selectedWorkspaceId.value
  if (props.type === EntityType.Category)
    return selectedBoardId.value === props.entity.board?.id || !selectedBoardId.value
  return selectedCategoryId.value === props.entity.category?.id || !selectedCategoryId.value
})

const getButtonTitle = computed(() => {
  if (props.type === EntityType.Task) return props.entity.category?.name || 'Без категории'
  if (props.type === EntityType.Category) return props.entity.board?.name || 'Без доски'
  return props.entity.workspace?.name || 'Без пространства'
})

function handleMove() {
  emit('move', {
    id: props.entity.id,
    newCategoryId: selectedCategoryId.value,
    newBoardId: selectedBoardId.value,
    newWorkspaceId: selectedWorkspaceId.value,
  })
  isPopoverOpen.value = false
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <MoveDropdownButton :title="getButtonTitle">
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
            <SelectContent>
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

        <div
          v-if="type !== EntityType.Board"
          class="flex flex-col gap-y-1.5 relative"
        >
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
            <SelectContent>
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

        <div
          v-if="type === EntityType.Task"
          class="flex flex-col gap-y-1.5 relative"
        >
          <label class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider"
            >Категория</label
          >

          <Skeleton
            v-if="isCategoriesLoading"
            class="h-8 w-full rounded-md"
          />

          <Select
            v-else
            v-model="selectedCategoryId"
            v-model:open="isCategoriesSelectOpen"
            :disabled="categories.length === 0"
          >
            <SelectTrigger
              class="h-8 text-custom-sm"
              :is-open="isCategoriesSelectOpen"
            >
              <SelectValue
                :placeholder="
                  categories.length === 0 ? 'Нет категорий...' : 'Выберите категорию...'
                "
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="c in categories"
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
          :disabled="isMoveDisabled || isBoardsLoading || isCategoriesLoading"
          @click="handleMove"
        >
          Переместить
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
