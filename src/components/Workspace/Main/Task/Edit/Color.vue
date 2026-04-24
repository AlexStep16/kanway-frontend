<script lang="ts" setup>
import { TaskModel } from '@models/TaskModel'
import { Palette, CircleOff, ChevronDown } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { COLOR_NAMES_MAP } from '@/constants/COLOR_NAMES_MAP'
import { TASK_COLORS_MAP, TASK_COLORS_TITLES } from '@/constants/TASK_COLORS'
import { HSDropdown, HSStaticMethods, ICollectionItem } from 'preline'
import { Nullable } from '@/types/utils'
import { getColorByNameAndTone } from '@/utils/getColorByNameAndTone'

const colorDropdownRef = ref<Nullable<HTMLElement>>(null)
const colorDropdownInstance = ref<Nullable<HSDropdown>>(null)

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (
    e: 'setColor',
    color: Nullable<{
      value: (typeof TASK_COLORS_TITLES)[number]
      tone: 'light' | 'medium' | 'dark'
    }>,
  ): void
}>()

const getColorName = (colorName?: Nullable<(typeof TASK_COLORS_TITLES)[number]>) => {
  if (!colorName) return 'Без цвета'

  return COLOR_NAMES_MAP[colorName] || colorName
}

const colorTitle = computed(() => {
  if (props.task.color) {
    return getColorName(props.task.color.value)
  } else {
    return 'Цвет'
  }
})

function setColor(name: (typeof TASK_COLORS_TITLES)[number], tone: 'light' | 'medium' | 'dark') {
  emit('setColor', {
    value: name,
    tone,
  })
}

function clearColor() {
  emit('setColor', null)

  closeColorDropdown()
}

function closeColorDropdown() {
  if (colorDropdownInstance.value) {
    colorDropdownInstance.value.close()
  }
}

function getGridColorsTemplate() {
  const colorsTemplate: {
    col: number
    row: number
    name: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }[] = []

  let row = 1
  let col = 1
  let minRow = 1
  let maxRow = 3

  for (const [, color] of Object.entries(TASK_COLORS_MAP)) {
    colorsTemplate.push({
      col,
      row,
      name: color.name as (typeof TASK_COLORS_TITLES)[number],
      tone: color.tone as unknown as 'light' | 'medium' | 'dark',
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
}

const taskColor = computed(() => {
  if (!props.task.color) return null

  return getColorByNameAndTone(props.task.color.value, props.task.color.tone)
})

function compareColors(
  taskColor?: Nullable<{
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }>,
  gridColor?: Nullable<{
    name: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }>,
) {
  if (!taskColor || !gridColor) return false

  return taskColor.value === gridColor.name && taskColor.tone === gridColor.tone
}

onMounted(() => {
  HSStaticMethods.autoInit()

  if (colorDropdownRef.value) {
    const instance = HSDropdown.getInstance(
      colorDropdownRef.value,
      true,
    ) as ICollectionItem<HSDropdown>
    colorDropdownInstance.value = instance.element
  }
})
</script>

<template>
  <div class="hs-dropdown [--auto-close:inside] relative inline-flex" ref="colorDropdownRef">
    <button
      id="hs-dropdown-color"
      type="button"
      class="hs-dropdown-toggle h-8 px-2 inline-flex items-center gap-x-2 text-xs sm:text-custom-sm font-medium border rounded-lg shadow-2xs transition-colors duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none:"
      :class="{
        'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 focus:bg-gray-200 ':
          !task.color,
        'bg-blue-100 border-blue-200 text-blue-500 hover:bg-blue-200 focus:bg-blue-200': task.color,
      }"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      <div class="flex items-center gap-x-2">
        <Palette class="size-3.5 sm:size-4" />
        <span>{{ colorTitle }}</span>
        <div
          v-if="taskColor"
          class="w-5 h-4 rounded-sm"
          :style="{ backgroundColor: taskColor }"
        ></div>
      </div>
      <ChevronDown
        class="inline-flex items-center justify-center size-4 duration-200 hs-dropdown-open:rotate-180"
      />
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="hs-dropdown-color"
    >
      <div class="flex flex-col p-2 gap-y-2">
        <span class="text-xs text-gray-400">Цвет</span>
        <div
          class="flex rounded-sm items-center text-neutral-400 justify-center p-1 gap-x-1 border border-neutral-300 pointer-events-none"
          v-if="!taskColor"
        >
          <CircleOff class="size-3" />
          <span class="text-custom-sm">Без цвета</span>
        </div>
        <div
          class="flex rounded-sm items-center px-2 py-1 gap-x-2 border pointer-events-none"
          :style="{ borderColor: taskColor }"
          v-else
        >
          <span class="text-custom-sm font-medium" :style="{ color: taskColor }">{{
            getColorName(task.color?.value)
          }}</span>
          <div class="w-full h-4 rounded-[1px]" :style="{ backgroundColor: taskColor }"></div>
        </div>
        <div
          class="max-h-50 overflow-y-auto overflow-x-visible pl-0.5 pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          <div class="grid grid-cols-4 grid-rows-[repeat(9, minmax(1.75rem, auto))] gap-1">
            <button
              class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100"
              :class="{
                'outline-2 outline-blue-500 outline-offset-1': compareColors(task.color, gridObj),
              }"
              v-for="gridObj in getGridColorsTemplate()"
              :key="gridObj.col + gridObj.row + gridObj.name + gridObj.tone"
              :style="{
                'grid-column-start': gridObj.col,
                'grid-row-start': gridObj.row,
                'background-color': getColorByNameAndTone(gridObj.name, gridObj.tone),
              }"
              @click.prevent.stop="setColor(gridObj.name, gridObj.tone)"
            />
          </div>
        </div>

        <div class="text-right text-custom-sm border-t border-gray-200 pt-2 my-1">
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-100 focus:outline-hidden"
            @click.prevent.stop="clearColor"
          >
            Убрать цвет
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
