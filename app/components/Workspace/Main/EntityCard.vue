<script setup lang="ts">
import {
  Clock,
  TextAlignStart,
  Archive,
  Copy,
  SquareKanban,
  Layers,
  Check,
  Flag,
} from '@lucide/vue'
import { Checkbox } from '~/components/ui/checkbox'

import { TimeStatus } from '~/enums/TimeStatus'

import { TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'
import { cn } from '~/lib/utils'

export interface EntityCardOptions {
  isChat?: boolean
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
    description?: string | null
    isCompleted?: boolean
    isDeleted: boolean
    priority?: 'low' | 'medium' | 'high' | null
    dueDate?: string | null
    dueHours?: number | null
    dueMinutes?: number | null
    color?: {
      value: (typeof TASK_COLORS_TITLES)[number]
      tone: 'light' | 'medium' | 'dark'
    } | null
    tags?: string[]
    column?: {
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

defineEmits<{
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

const hasInfo = computed(() => props.entity.column || props.entity.board)
const isEntityCompletable = computed(
  () => !!props.options?.isCompletable && !props.options?.isStatic,
)

function getPriorityHumanReadable(priority: 'low' | 'medium' | 'high'): string {
  const titles = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
  }

  return titles[priority]
}
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col shrink-0 rounded-md min-w-60 cursor-pointer hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none',
        !options?.isChat && 'hover:shadow-md',
        options?.hasBorder && 'border border-gray-200',
        !options?.hasBorder && 'shadow-sm',
        options?.isStatic && 'hover:shadow-none cursor-default select-auto',
        classes || '',
      )
    "
    @click="$emit('edit')"
  >
    <div class="flex flex-col gap-y-2 p-3 group/task relative">
      <div
        class="h-2 w-4.5 rounded-full"
        v-if="entityColor"
        :style="{ backgroundColor: entityColor }"
      />
      <!-- Info -->
      <div
        class="flex items-center flex-wrap gap-2"
        v-if="options?.showInfo && hasInfo"
      >
        <div
          class="flex items-center gap-x-1 text-gray-500 max-w-full"
          v-if="entity.column"
        >
          <Layers class="size-3 shrink-0" /><span class="text-xs truncate">{{
            entity.column.name ?? 'Без колонки'
          }}</span>
        </div>
        <div
          class="flex items-center gap-x-1 text-gray-500 max-w-full"
          v-if="entity.board"
        >
          <SquareKanban class="size-3 shrink-0" /><span class="text-xs truncate">{{
            entity.board.name ?? 'Без доски'
          }}</span>
        </div>
      </div>

      <div class="flex items-start justify-between gap-x-2">
        <div
          class="flex items-start pr-14 pointer-fine:pr-0 gap-x-1.5 shrink min-w-0 text-gray-800 transform transition-all duration-100"
          :class="{
            'translate-x-0!': entity.isCompleted,
            'group-hover/task:translate-x-0 pointer-fine:-translate-x-6': isEntityCompletable,
          }"
        >
          <div
            class="relative top-px inline-flex items-center pointer-fine:opacity-0 pointer-fine:pointer-events-none transition-all duration-100 group-hover/task:opacity-100 group-hover/task:pointer-events-auto"
            :class="{
              'opacity-100! pointer-events-auto!': entity.isCompleted,
            }"
            v-if="isEntityCompletable"
          >
            <div class="flex items-center justify-center">
              <Label
                class="flex items-center cursor-pointer relative transition-all select-none"
                role="checkbox"
                :aria-checked="entity.isCompleted ?? false"
                tabindex="0"
                @click.stop.prevent="$emit('toggleCompletion')"
                @keydown.space.prevent.stop="$emit('toggleCompletion')"
                @keydown.enter.prevent.stop="$emit('toggleCompletion')"
              >
                <Checkbox
                  :model-value="entity.isCompleted ?? false"
                  :disabled="!isEntityCompletable"
                  tabindex="-1"
                  aria-hidden="true"
                  class="pointer-events-none size-4.5 rounded-full border-slate-300 bg-slate-100 text-white shadow data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                >
                  <Check
                    class="size-3"
                    stroke-width="4"
                  />
                </Checkbox>
              </Label>
            </div>
          </div>
          <span
            :class="
              cn(
                'text-sm overflow-hidden wrap-break-word font-medium text-secondary-foreground',
                entity.isCompleted && 'text-gray-300 decoration-1 line-through',
              )
            "
          >
            {{ entity.name }}
          </span>
        </div>

        <div
          class="flex items-center absolute right-2 pointer-fine:opacity-0 transition-all pointer-events-none duration-100 top-2"
          :class="{
            'group-hover/task:opacity-100 group-hover/task:bg-white pointer-events-auto!':
              isCopyAvailable || isDeleteAvailable,
          }"
        >
          <TooltipProvider :disableHoverableContent="true">
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  type="button"
                  class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
                  @click.stop="$emit('copy')"
                  v-if="isCopyAvailable"
                >
                  <Spinner
                    v-if="toValue(status.isCloning)"
                    class="size-4"
                  />
                  <Copy
                    v-else
                    class="size-4"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Копировать</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider :disableHoverableContent="true">
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  type="button"
                  class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
                  title="Архивировать"
                  v-if="isDeleteAvailable"
                  @click.stop="$emit('archive')"
                >
                  <Spinner
                    v-if="toValue(status.isArchiving)"
                    class="size-4"
                  />
                  <Archive
                    v-else
                    class="size-4"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Архивировать</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <!-- Описание -->
      <div
        class="flex items-center text-xs text-gray-500 gap-1"
        v-if="entity.description"
      >
        <TextAlignStart class="size-3" />
        <span class="decoration-1 hover:underline">Есть описание</span>
      </div>

      <!-- Теги -->
      <div
        v-if="entity.tags?.length"
        class="flex flex-wrap gap-1.5"
      >
        <Badge
          v-for="tag in entity.tags"
          :key="tag"
          variant="secondaryMuted"
          class="text-xs rounded-sm max-w-full truncate"
        >
          <span class="truncate">#{{ tag }}</span>
        </Badge>
      </div>

      <!-- Дата выполнения -->
      <div
        class="flex items-center gap-x-2"
        v-if="entity.dueDate || entity.priority"
      >
        <div
          class="inline-flex items-center self-start gap-x-2 text-xs rounded-sm px-2 h-6"
          :class="dateBadgeClasses"
          v-if="entity.dueDate"
        >
          <Clock class="size-4" />
          <span v-if="entity.dueDate">{{ readableDate }}</span>
        </div>

        <Badge
          v-if="entity.priority"
          variant="outline"
          :class="
            cn(
              'flex self-start items-center gap-x-1 text-xs font-normal rounded-sm border-none h-6',
              entity.priority === 'low' && 'bg-emerald-100 text-emerald-600',
              entity.priority === 'medium' && 'bg-amber-100 text-amber-600',
              entity.priority === 'high' && 'bg-rose-100 text-rose-600',
            )
          "
          title="Приоритет"
        >
          <Flag class="size-3" />
          {{ getPriorityHumanReadable(entity.priority) }}
        </Badge>
      </div>

      <slot />
    </div>
  </div>
</template>
