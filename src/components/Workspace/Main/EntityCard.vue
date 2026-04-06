<script setup lang="ts">
import { computed, ComputedRef, ref, toValue } from 'vue'
import { Clock, TextAlignStart, Archive, Copy, SquareKanban, Layers } from 'lucide-vue-next'

import { TimeStatus } from '@/enums/TimeStatus'
import { getTimeInReadableFormat } from '@utils/date'
import { getTimeStatus } from '@/helpers/getTimeStatus'

import Spinner from '@/components/Loader/Spinner.vue'
import { getColorByNameAndTone } from '@/utils/getColorByNameAndTone'
import { Nullable, OptionalNullable } from '@/types/utils'
import { TASK_COLORS_TITLES } from '@/constants/TASK_COLORS'

export interface EntityCardOptions {
  hasBorder?: boolean
  hasCheckbox?: boolean
  isCompletable?: boolean
  hasCopy?: boolean
  hasDelete?: boolean
  showInfo?: boolean
  isStatic?: boolean
}

const props = defineProps<{
  entity: {
    id: string
    name: string
    description?: Nullable<string>
    isCompleted?: boolean
    isDeleted: boolean
    dueDate?: Nullable<string>
    dueHours?: Nullable<number>
    dueMinutes?: Nullable<number>
    color?: OptionalNullable<{
      value: (typeof TASK_COLORS_TITLES)[number]
      tone: 'light' | 'medium' | 'dark'
    }>
    tags?: string[]
    category?: {
      id: string
      name?: string
    }
    board?: {
      id: string
      name?: string
    }
    workspace?: {
      id: string
      name?: string
    }
  }
  options?: EntityCardOptions
  status: {
    isArchiving: ComputedRef<boolean>
    isRecovering: ComputedRef<boolean>
    isCloning: ComputedRef<boolean>
    isFavoritePending?: ComputedRef<boolean>
    isMoving: ComputedRef<boolean>
    isDeleting: ComputedRef<boolean>
    isUpdating: ComputedRef<boolean>
    isUpdatingMany: ComputedRef<boolean>
    isBusy: ComputedRef<boolean>
  }

  selectedIds?: string[]
  classes?: string
}>()

const emits = defineEmits<{
  (e: 'toggleCompletion'): void
  (e: 'toggleSelect'): void
  (e: 'archive'): void
  (e: 'copy'): void
  (e: 'delete'): void
  (e: 'edit'): void
}>()

// --- Computed Styles ---
const timeStatus = computed(() =>
  getTimeStatus(
    props.entity.dueDate!,
    props.entity.isCompleted ?? false,
    props.entity.dueHours,
    props.entity.dueMinutes,
  ),
)

const dateBadgeClasses = computed(() => {
  switch (timeStatus.value) {
    case TimeStatus.EXPIRED:
      return 'bg-red-100 text-red-500'
    case TimeStatus.EXPIRING:
      return 'bg-yellow-100 text-yellow-600'
    case TimeStatus.COMPLETED:
      return 'bg-green-100 text-green-600'
    default:
      return 'bg-gray-100 text-gray-500'
  }
})

const isCopyAvailable = computed(() => props.options?.hasCopy && !props.entity.isDeleted)
const isDeleteAvailable = computed(() => props.options?.hasDelete && !props.entity.isDeleted)

const readableDate = computed(() =>
  props.entity.dueDate
    ? getTimeInReadableFormat(props.entity.dueDate, props.entity.dueHours, props.entity.dueMinutes)
    : '',
)

const entityColor = computed(() => {
  if (!props.entity.color) return null

  return getColorByNameAndTone(props.entity.color.value, props.entity.color.tone)
})

const isSelected = computed(() => props.selectedIds?.includes(props.entity.id))
const hasInfo = computed(() => props.entity.category || props.entity.board)
const isEntityCompletable = computed(() => props.options?.isCompletable && !props.options?.isStatic)
</script>

<template>
  <div
    class="flex flex-col shrink-0 rounded-md min-w-60 cursor-pointer hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
    :class="{
      'border border-gray-200': options?.hasBorder,
      'shadow-sm': !options?.hasBorder,
      [classes || '']: !!classes,
    }"
    @click="$emit('edit')"
  >
    <div class="h-3 w-full" v-if="entityColor" :style="{ backgroundColor: entityColor }" />
    <div class="flex flex-col gap-y-2 p-3 group/task relative">
      <!-- Info -->
      <div class="flex items-center flex-wrap gap-2" v-if="options?.showInfo && hasInfo">
        <div class="flex items-center gap-x-1 text-gray-500" v-if="entity.category">
          <Layers class="size-3" /><span class="text-xs">{{
            entity.category.name ?? 'Без категории'
          }}</span>
        </div>
        <div class="flex items-center gap-x-1 text-gray-500" v-if="entity.board">
          <SquareKanban class="size-3" /><span class="text-xs">{{
            entity.board.name ?? 'Без доски'
          }}</span>
        </div>
      </div>

      <div class="flex items-start justify-between gap-x-2">
        <div
          class="flex items-center pr-14 pointer-fine:pr-0 gap-x-1 shrink overflow-hidden min-w-0 text-gray-800 transform pointer-fine:-translate-x-6 transition-all duration-100"
          :class="{
            'translate-x-0!': entity.isCompleted,
            'group-hover/task:translate-x-0': isEntityCompletable,
          }"
        >
          <div
            class="inline-flex items-center pointer-fine:opacity-0 pointer-fine:pointer-events-none transition-all duration-100"
            :class="{
              'opacity-100! pointer-events-auto!': entity.isCompleted,
              'group-hover/task:opacity-100 group-hover/task:pointer-events-auto':
                isEntityCompletable,
            }"
          >
            <div class="size-5 flex items-center justify-center">
              <label
                class="flex items-center cursor-pointer relative transition-all select-none"
                @click.stop
              >
                <input
                  type="checkbox"
                  class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600"
                  :checked="entity.isCompleted"
                  :disabled="!isEntityCompletable"
                  :id="'toggleCompletion-checkbox' + entity.id"
                  @change="$emit('toggleCompletion')"
                />
                <span
                  class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </label>
            </div>
          </div>
          <span
            class="text-sm overflow-hidden wrap-break-word"
            :class="{
              'text-gray-300 decoration-1 line-through': entity.isCompleted,
            }"
          >
            {{ entity.name }}
          </span>
        </div>

        <label
          class="flex items-center cursor-pointer relative transition-all"
          @click.stop
          v-if="options?.hasCheckbox && selectedIds"
        >
          <input
            type="checkbox"
            class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-600"
            :id="'selected-checkbox' + entity.id"
            @change="$emit('toggleSelect')"
            :checked="isSelected"
          />
          <span
            class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-3"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="1"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        </label>

        <div
          class="flex items-center absolute right-2 pointer-fine:opacity-0 transition-all pointer-events-none duration-100 top-2"
          :class="{
            'group-hover/task:opacity-100 group-hover/task:bg-white pointer-events-auto!':
              isCopyAvailable || isDeleteAvailable,
          }"
        >
          <button
            type="button"
            class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Копировать"
            @click.stop="$emit('copy')"
            v-if="isCopyAvailable"
          >
            <Spinner v-if="toValue(status.isCloning)" class="size-4" />
            <Copy v-else class="size-4" />
          </button>
          <button
            type="button"
            class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
            title="Архивировать"
            v-if="isDeleteAvailable"
            @click.stop="$emit('archive')"
          >
            <Spinner v-if="toValue(status.isArchiving)" class="size-4" />
            <Archive v-else class="size-4" />
          </button>
        </div>
      </div>

      <!-- Описание -->
      <div class="flex items-center text-xs text-gray-500 gap-1" v-if="entity.description">
        <TextAlignStart class="size-3" />
        <span class="decoration-1 hover:underline">Есть описание</span>
      </div>

      <!-- Теги -->
      <div
        class="flex flex-wrap text-xs text-gray-500 gap-1"
        v-if="entity.tags && entity.tags.length"
      >
        {{ entity.tags.map((t) => '#' + t).join(' ') }}
      </div>

      <!-- Дата выполнения -->
      <div
        v-if="entity.dueDate"
        class="inline-flex items-center self-start gap-x-2 text-xs rounded-sm py-1 px-2"
        :class="dateBadgeClasses"
      >
        <Clock class="size-4" />
        <span v-if="entity.dueDate">{{ readableDate }}</span>
      </div>

      <slot />
    </div>
  </div>
</template>
