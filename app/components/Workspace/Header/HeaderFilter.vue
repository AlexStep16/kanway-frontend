<script setup lang="ts">
import { ListFilter } from '@lucide/vue'
import { Checkbox } from '~/components/ui/checkbox'
import { Badge } from '~/components/ui/badge'
import { useTaskFilterStore } from '~/stores/taskFilters'
import { TASK_COLORS_MAP } from '~/constants/TASK_COLORS'

const boardStore = useBoardStore()
const activeBoardId = computed(() => boardStore.activeBoardId)

const { data: tasks } = useTasks(activeBoardId)
const filterStore = useTaskFilterStore()

const isMenuOpen = ref(false)

const filters = computed(() => filterStore.filters)

const statusOptions = [
  { key: 'isCompleted', label: 'Завершённые' },
  { key: 'isInProgress', label: 'В работе' },
  { key: 'isExpired', label: 'Просроченные' },
  { key: 'isDueToday', label: 'Сегодня' },
  { key: 'isDueTomorrow', label: 'Завтра' },
  { key: 'isDueThisWeek', label: 'На этой неделе' },
] as const

const priorityOptions = [
  { key: 'low' as const, label: 'Низкий' },
  { key: 'medium' as const, label: 'Средний' },
  { key: 'high' as const, label: 'Высокий' },
]

// only show hex values actually used on non-deleted board tasks
const availableColors = computed(() => {
  const hexes = new Set<string>()
  tasks.value?.forEach((t) => {
    if (t.isDeleted || !t.color) return
    const entry = Object.entries(TASK_COLORS_MAP).find(
      ([, v]) => v.name === t.color!.value && v.tone === t.color!.tone,
    )
    if (entry) hexes.add(entry[0])
  })
  return Array.from(hexes).map((hex) => ({
    hex,
    ru: TASK_COLORS_MAP[hex as keyof typeof TASK_COLORS_MAP]?.ru,
  }))
})

const availableTags = computed(() => {
  const tags = new Set<string>()
  tasks.value?.forEach((t) => {
    if (t.isDeleted) return
    t.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
})

function toggleStatus(key: (typeof statusOptions)[number]['key']) {
  filterStore.filters[key] = !filterStore.filters[key]
}

function togglePriority(key: 'low' | 'medium' | 'high') {
  const idx = filterStore.filters.priorities.indexOf(key)
  if (idx === -1) filterStore.filters.priorities.push(key)
  else filterStore.filters.priorities.splice(idx, 1)
}

function toggleColor(hex: string) {
  const idx = filterStore.filters.colors.indexOf(hex)
  if (idx === -1) filterStore.filters.colors.push(hex)
  else filterStore.filters.colors.splice(idx, 1)
}

function toggleTag(tag: string) {
  const index = filterStore.filters.tags.indexOf(tag)
  if (index === -1) filterStore.filters.tags.push(tag)
  else filterStore.filters.tags.splice(index, 1)
}
</script>

<template>
  <Popover v-model:open="isMenuOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        class="relative flex items-center gap-x-1.5 p-2 rounded-md text-sm focus:outline-none transition-colors duration-100"
        :class="
          filterStore.isFilterActive
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 data-[state=open]:bg-blue-200'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200 data-[state=open]:bg-blue-200 data-[state=open]:text-primary'
        "
      >
        <ListFilter class="size-4 shrink-0" />
        <span
          v-if="filterStore.isFilterActive"
          class="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-blue-500"
        />
      </button>
    </PopoverTrigger>

    <PopoverContent
      class="w-64 p-3"
      align="end"
      :side-offset="5"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-gray-800">Фильтры</span>

        <button
          type="button"
          class="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!filterStore.isFilterActive"
          @click="filterStore.clearFilters"
        >
          Сбросить
        </button>
      </div>

      <div class="flex flex-col gap-y-1.5">
        <label
          v-for="option in statusOptions"
          :key="option.key"
          class="flex items-center gap-x-2 text-sm text-gray-700 cursor-pointer select-none"
        >
          <Checkbox
            :model-value="filters[option.key]"
            @update:model-value="toggleStatus(option.key)"
          />
          {{ option.label }}
        </label>
      </div>

      <!-- Priority -->
      <div class="h-px bg-gray-200 my-2.5" />

      <span class="text-xs font-semibold text-gray-500">Приоритет</span>

      <div class="flex gap-x-2 mt-1.5">
        <button
          v-for="p in priorityOptions"
          :key="p.key"
          type="button"
          class="flex-1 py-1 text-xs font-medium rounded-md border transition-colors duration-100 select-none"
          :class="
            filters.priorities.includes(p.key)
              ? 'border-transparent bg-gray-800 text-white'
              : 'border-gray-200 text-gray-600 hover:border-gray-400'
          "
          @click="togglePriority(p.key)"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Colors -->
      <template v-if="availableColors.length > 0">
        <div class="h-px bg-gray-200 my-2.5" />

        <span class="text-xs font-semibold text-gray-500">Цвет</span>

        <div class="flex flex-wrap gap-2 mt-1.5">
          <button
            v-for="swatch in availableColors"
            :key="swatch.hex"
            type="button"
            class="size-5 rounded-full transition-transform duration-100 ring-offset-1"
            :style="{ backgroundColor: swatch.hex }"
            :class="
              filters.colors.includes(swatch.hex)
                ? 'ring-2 ring-gray-800 scale-110'
                : 'hover:scale-110'
            "
            :title="swatch.ru"
            @click="toggleColor(swatch.hex)"
          />

          <!-- No color swatch -->
          <button
            type="button"
            class="size-5 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center transition-transform duration-100 ring-offset-1"
            :class="
              filters.isNoColor
                ? 'ring-2 ring-gray-800 scale-110 border-gray-500'
                : 'hover:scale-110 hover:border-gray-400'
            "
            title="Без цвета"
            @click="filterStore.filters.isNoColor = !filterStore.filters.isNoColor"
          >
            <span class="block size-2 rounded-full bg-gray-300" />
          </button>
        </div>
      </template>

      <template v-if="availableTags.length > 0">
        <div class="h-px bg-gray-200 my-2.5" />

        <span class="text-xs font-semibold text-gray-500">Теги</span>

        <div class="flex flex-wrap gap-1.5 mt-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-0.5">
          <Badge
            v-for="tag in availableTags"
            :key="tag"
            :variant="filters.tags.includes(tag) ? 'default' : 'outline'"
            class="cursor-pointer select-none max-w-full truncate"
            @click="toggleTag(tag)"
          >
            <span class="truncate">#{{ tag }}</span>
          </Badge>
        </div>
      </template>
    </PopoverContent>
  </Popover>
</template>
