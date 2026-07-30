<script lang="ts" setup>
import { ChevronDown, Flag, CircleOff } from '@lucide/vue'
import { cn } from '~/lib/utils'
import type { TaskModel } from '~/models/TaskModel'

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (e: 'setPriority', priority: 'low' | 'medium' | 'high' | null): void
}>()

const isPopoverOpen = ref(false)

const PRIORITY_OPTIONS: Array<{
  value: 'low' | 'medium' | 'high'
  label: string
  classes: string
}> = [
  {
    value: 'low',
    label: 'Низкий',
    classes: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
  },
  {
    value: 'medium',
    label: 'Средний',
    classes: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  },
  {
    value: 'high',
    label: 'Высокий',
    classes: 'bg-rose-100 text-rose-600 hover:bg-rose-200',
  },
]

const selectedPriority = computed(() => {
  return PRIORITY_OPTIONS.find((option) => option.value === props.task.priority) || null
})

const title = computed(() => {
  return selectedPriority.value ? selectedPriority.value.label : 'Приоритет'
})

function handleSetPriority(priority: 'low' | 'medium' | 'high' | null) {
  emit('setPriority', priority)
  isPopoverOpen.value = false
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
          <Flag
            class="size-3.5 sm:size-4"
            :class="{
              'text-rose-500': task.priority === 'high',
              'text-amber-500': task.priority === 'medium',
              'text-emerald-500': task.priority === 'low',
            }"
          />
          <span>{{ title }}</span>
        </div>
        <ChevronDown
          class="size-3.5 transition-transform duration-200"
          :class="{
            'rotate-180': isPopoverOpen,
          }"
        />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      class="w-48 p-2"
      align="start"
      :side-offset="8"
    >
      <div class="flex flex-col gap-y-1.5">
        <button
          v-for="option in PRIORITY_OPTIONS"
          :key="option.value"
          type="button"
          class="h-8 rounded-md px-2 text-xs font-medium text-left transition-colors"
          :class="option.classes"
          @click="handleSetPriority(option.value)"
        >
          {{ option.label }}
        </button>

        <button
          type="button"
          class="mt-1 inline-flex items-center gap-x-1 text-xs text-muted-foreground transition-colors hover:text-rose-500"
          @click="handleSetPriority(null)"
        >
          <CircleOff class="size-3.5" />
          Без приоритета
        </button>
      </div>
    </PopoverContent>
  </Popover>
</template>
