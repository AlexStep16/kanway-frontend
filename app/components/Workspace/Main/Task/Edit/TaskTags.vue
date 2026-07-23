<script lang="ts" setup>
import { ChevronDown, Hash, X, Plus } from '@lucide/vue'
import type { TaskModel } from '~/models/TaskModel'

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (e: 'removeTag', index: number): void
  (e: 'addTag', tag: string): void
}>()

const newTag = ref<string>('')
const isPopoverOpen = ref(false)

// Грамматика для тегов (оставляем твою логику)
function getTagsEnding(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return ' тег'
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return ' тега'
  return ' тегов'
}

const getTagsTitle = computed(() => {
  const count = props.task.tags.length
  return count > 0 ? `${count}${getTagsEnding(count)}` : 'Теги'
})

function handleAddTag() {
  const tag = newTag.value.trim()
  if (!tag) return
  emit('addTag', tag)
  newTag.value = ''
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        class="group h-8 px-2.5 inline-flex items-center gap-x-2 text-xs sm:text-sm font-medium border rounded-lg shadow-sm transition-all duration-200 focus:outline-none disabled:opacity-50"
        :class="[
          task.tags.length === 0
            ? 'bg-secondary border-transparent text-muted-foreground hover:bg-secondary/80'
            : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20',
        ]"
      >
        <div class="flex items-center gap-x-1">
          <Hash class="size-3.5" />
          <span>{{ getTagsTitle }}</span>
        </div>
        <ChevronDown
          class="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </button>
    </PopoverTrigger>

    <PopoverContent
      class="w-54 p-2"
      align="start"
      :side-offset="8"
    >
      <div class="space-y-3">
        <div class="flex flex-col gap-y-1">
          <span class="text-xs text-gray-400">Текущие теги</span>
          <div
            v-if="task.tags.length > 0"
            class="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar"
          >
            <Badge
              v-for="(tag, index) in task.tags"
              :key="tag + task.id"
              variant="secondary"
              class="pl-2 pr-1 py-0.5 text-[11px] font-medium transition-colors hover:bg-secondary/80"
            >
              {{ tag }}
              <button
                type="button"
                class="ml-1 p-0.5 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                @click.stop="emit('removeTag', index)"
              >
                <X class="size-3" />
              </button>
            </Badge>
          </div>
          <p
            v-else
            class="text-xs text-muted-foreground italic"
          >
            Тегов пока нет
          </p>
        </div>

        <!-- Поле добавления -->
        <div class="space-y-2">
          <div class="flex flex-col gap-y-1">
            <Input
              v-model="newTag"
              placeholder="Новый тег..."
              class="h-8 text-xs focus-visible:ring-primary"
              @keyup.enter="handleAddTag"
            />
            <Button
              size="sm"
              variant="primaryMuted"
              class="text-xs gap-x-1"
              @click="handleAddTag"
              :disabled="!newTag.trim()"
            >
              <Plus class="size-4" />
              Добавить
            </Button>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
