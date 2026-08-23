<script lang="ts" setup>
import { TaskModel } from '~/models/TaskModel'
import { Palette, CircleOff, ChevronDown } from '@lucide/vue'
import { TASK_COLORS_MAP, TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'
import { cn } from '~/lib/utils'

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (
    e: 'setColor',
    color: { value: (typeof TASK_COLORS_TITLES)[number]; tone: 'light' | 'medium' | 'dark' } | null,
  ): void
}>()

const isPopoverOpen = ref(false)

const getColorName = (
  colorName?: (typeof TASK_COLORS_TITLES)[number] | null,
  tone?: 'light' | 'medium' | 'dark',
) => {
  if (!colorName) return 'Без цвета'
  const entry = Object.values(TASK_COLORS_MAP).find(
    (c) => c.name === colorName && (!tone || c.tone === tone),
  )
  const name = entry?.ru || colorName
  return name.at(0)?.toUpperCase() + name.slice(1)
}

const colorTitle = computed(() => {
  return props.task.color ? getColorName(props.task.color.value, props.task.color.tone) : 'Цвет'
})

const taskColorHex = computed(() => {
  if (!props.task.color) return null
  return getColorByNameAndTone(props.task.color.value, props.task.color.tone)
})

const gridColors = computed(() => {
  const colorsTemplate = []
  let row = 1,
    col = 1,
    minRow = 1,
    maxRow = 3

  for (const [, color] of Object.entries(TASK_COLORS_MAP)) {
    colorsTemplate.push({
      col,
      row,
      name: color.name as (typeof TASK_COLORS_TITLES)[number],
      tone: color.tone as 'light' | 'medium' | 'dark',
    })
    row++
    if (row > maxRow) {
      row = minRow
      col++
    }
    if (col > 4) {
      col = 1
      minRow += 3
      maxRow += 3
      row = minRow
    }
  }
  return colorsTemplate
})

function handleSetColor(
  name: (typeof TASK_COLORS_TITLES)[number],
  tone: 'light' | 'medium' | 'dark',
) {
  emit('setColor', { value: name, tone })
  isPopoverOpen.value = false
}

function handleClearColor() {
  emit('setColor', null)
  isPopoverOpen.value = false
}

function isSelected(gridColor: any) {
  if (!props.task.color) return false
  return props.task.color.value === gridColor.name && props.task.color.tone === gridColor.tone
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-auto text-muted-foreground text-xs sm:text-custom-sm')"
        size="sm"
      >
        <div class="flex items-center gap-x-2">
          <div
            v-if="taskColorHex"
            class="w-5 h-3.5 rounded-sm border border-black/5"
            :style="{ backgroundColor: taskColorHex }"
          />
          <Palette
            class="size-3.5 sm:size-4"
            v-else
          />
          <span>{{ colorTitle }}</span>
        </div>
        <ChevronDown
          class="size-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180"
          :class="{
            'rotate-180': isPopoverOpen,
          }"
        />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      class="w-64 p-3"
      align="start"
    >
      <div class="flex flex-col gap-y-3">
        <span class="text-[10px] uppercase font-bold text-muted-foreground tracking-wider"
          >Цвет</span
        >

        <!-- Текущий выбранный цвет -->
        <div
          v-if="!taskColorHex"
          class="flex h-9 rounded-md items-center justify-center gap-x-2 border border-dashed border-muted-foreground/30 text-muted-foreground/60"
        >
          <CircleOff class="size-3.5" />
          <span class="text-xs">Без цвета</span>
        </div>
        <div
          v-else
          class="flex h-9 rounded-md items-center px-3 gap-x-3 border bg-muted/20"
          :style="{ borderColor: taskColorHex + '40' }"
        >
          <span
            class="text-xs font-semibold"
            :style="{ color: taskColorHex }"
          >
            {{ getColorName(task.color?.value, task.color?.tone) }}
          </span>
          <div
            class="flex-1 h-4 rounded-[2px]"
            :style="{ backgroundColor: taskColorHex }"
          />
        </div>

        <!-- Сетка цветов -->
        <div class="max-h-52 overflow-y-auto p-1 custom-scrollbar">
          <div class="grid grid-cols-4 gap-1.5">
            <button
              v-for="gridObj in gridColors"
              :key="`${gridObj.name}-${gridObj.tone}`"
              class="h-7 w-full rounded-[3px] transition-transform hover:scale-110 active:scale-95"
              :class="{
                'ring-2 ring-blue-500 ring-offset-2 z-10': isSelected(gridObj),
              }"
              :style="{
                'grid-column-start': gridObj.col,
                'grid-row-start': gridObj.row,
                'background-color': getColorByNameAndTone(gridObj.name, gridObj.tone),
              }"
              @click="handleSetColor(gridObj.name, gridObj.tone)"
            />
          </div>
        </div>

        <!-- Кнопка очистки -->
        <div class="flex justify-end gap-x-2 border-t p-3 pb-0">
          <span
            class="font-medium w-auto text-xs text-muted-foreground cursor-pointer hover:text-red-500 transition-colors duration-200"
            @click="handleClearColor"
          >
            Удалить цвет
          </span>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
