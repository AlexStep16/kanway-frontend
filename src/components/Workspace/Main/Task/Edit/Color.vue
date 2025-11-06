<script lang="ts" setup>
import { TaskModel } from '@models/TaskModel'
import { Palette, CircleOff } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { COLOR_NAMES, COLOR_NAMES_MAP } from '@/constants/COLOR_NAMES_MAP'
import { TASK_COLORS, TASK_COLORS_MAP } from '@/constants/TASK_COLORS'
import { HSDropdown, HSStaticMethods, ICollectionItem } from 'preline'
import { Nullable } from '@/types/utils'

const colorDropdownRef = ref<Nullable<HTMLElement>>(null)
const colorDropdownInstance = ref<Nullable<HSDropdown>>(null)

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (
    e: 'setColor',
    color: Nullable<(typeof TASK_COLORS)[number]>,
    colorName: Nullable<(typeof COLOR_NAMES)[number]>,
  ): void
  (e: 'clearColor'): void
}>()

const getColorName = (colorName?: Nullable<(typeof COLOR_NAMES)[number]>) => {
  if (!colorName) return 'Без цвета'

  const loweredColorName = colorName.toLowerCase() as keyof typeof COLOR_NAMES_MAP
  return COLOR_NAMES_MAP[loweredColorName] || colorName
}

const getColorTitle = computed(() => {
  if (props.task.colorName) {
    return getColorName(props.task.colorName)
  } else {
    return 'Цвет'
  }
})

function setColor(color: (typeof TASK_COLORS)[number]) {
  emit('setColor', color, (TASK_COLORS_MAP[color] as (typeof COLOR_NAMES)[number]) || null)
}

function clearColor() {
  emit('clearColor')

  closeColorDropdown()
}

function closeColorDropdown() {
  if (colorDropdownInstance.value) {
    colorDropdownInstance.value.close()
  }
}

function getGridColorsTemplate(): {
  col: number
  row: number
  color: (typeof TASK_COLORS)[number]
}[] {
  const colorsTemplate: { col: number; row: number; color: (typeof TASK_COLORS)[number] }[] = []
  let row = 1
  let col = 1
  let minRow = 1
  let maxRow = 3

  for (const color of TASK_COLORS) {
    colorsTemplate.push({ col, row, color })

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
      class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border rounded-lg shadow-2xs transition-colors duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none:"
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
        <Palette class="size-4" />
        <span>{{ getColorTitle }}</span>
        <div
          v-if="task.color"
          class="w-5 h-4 rounded-sm"
          :style="{ backgroundColor: task.color }"
        ></div>
      </div>
      <svg
        class="hs-dropdown-open:rotate-180 size-4"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
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
          class="flex rounded-sm items-center text-neutral-400 justify-center p-1 gap-x-1 border-1 border-neutral-300 pointer-events-none"
          v-if="!task.color"
        >
          <CircleOff class="size-3" />
          <span class="text-custom-sm">Без цвета</span>
        </div>
        <div
          class="flex rounded-sm items-center px-2 py-1 gap-x-2 border-1 pointer-events-none"
          :style="{ borderColor: task.color }"
          v-else
        >
          <span class="text-custom-sm font-medium" :style="{ color: task.color }">{{
            getColorName(task.colorName)
          }}</span>
          <div class="w-full h-4 rounded-[1px]" :style="{ backgroundColor: task.color }"></div>
        </div>
        <div
          class="max-h-50 overflow-y-auto overflow-x-visible pl-[2px] pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          <div class="grid grid-cols-4 grid-rows-[repeat(9, minmax(1.75rem, auto))] gap-1">
            <button
              class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100"
              :class="{
                'outline-2 outline-blue-500 outline-offset-1': task.color === gridObj.color,
              }"
              v-for="gridObj in getGridColorsTemplate()"
              :key="gridObj.col + gridObj.row + gridObj.color"
              :style="{
                'grid-column-start': gridObj.col,
                'grid-row-start': gridObj.row,
                'background-color': gridObj.color,
              }"
              @click.prevent.stop="setColor(gridObj.color)"
            />
          </div>
        </div>

        <div class="text-right text-custom-sm border-t-1 border-gray-200 pt-2 my-1">
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
