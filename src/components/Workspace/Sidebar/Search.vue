<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import { Search, SearchX } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import { useBoardSearch } from '@/composables/useBoardSearch'
import { useBoardStore } from '@/stores/board'
import { storeToRefs } from 'pinia'
import Button from '@/components/ui/button/Button.vue'
import { useUIStore } from '@/stores/ui'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'

const open = ref(false)
const search = ref('')
const searchRef = ref<HTMLInputElement | null>(null)

const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const { tasks, categories, isEmpty, isPending } = useBoardSearch(search, activeBoardId)

const connectExposed = (exposed: any) => {
  if (exposed?.inputRef) searchRef.value = exposed.inputRef
}

watch(search, (newValue) => {
  if (newValue) open.value = true
  else open.value = false
})

const focusOutsideHandler = (event: any) => {
  if (searchRef.value && !searchRef.value.contains(event.target)) {
    open.value = false
    search.value = ''
  } else event.preventDefault()
}
</script>

<template>
  <Popover v-model:open="open" v-if="activeBoardId">
    <PopoverAnchor class="w-80" as-child>
      <div class="flex items-center px-3 rounded-md bg-popover text-popover-foreground border">
        <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          :ref="connectExposed"
          v-model="search"
          placeholder="Поиск по доске..."
          class="border-0 bg-transparent p-0 text-sm outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Spinner v-if="isPending" class="ms-2 size-4 text-muted-foreground shrink-0" />
      </div>
    </PopoverAnchor>
    <PopoverContent
      class="w-80 px-0 flex flex-col gap-y-4 duration-0! animate-none!"
      @open-auto-focus.prevent
      @pointer-down-outside="focusOutsideHandler"
    >
      <ScrollArea>
        <div class="max-h-120 px-3">
          <template v-if="!isPending">
            <div v-if="isEmpty" class="flex flex-col items-center justify-center gap-y-2 py-4">
              <SearchX class="h-6 w-6 opacity-50" />
              <span class="text-sm text-muted-foreground">Ничего не найдено</span>
            </div>

            <div class="flex flex-col gap-y-2" v-if="tasks.length > 0">
              <span class="px-3 text-xs font-medium text-muted-foreground">Задачи</span>

              <div class="flex flex-col gap-y-1">
                <Button
                  variant="secondary"
                  class=""
                  size="sm"
                  v-for="task in tasks"
                  :key="task.id"
                  @click="uiStore.openTaskToEdit(task)"
                >
                  <span class="text-sm truncate" :title="task.name">{{ task.name }}</span>
                  <span class="ms-auto text-xs text-muted-foreground">{{
                    task.category.name
                  }}</span>
                </Button>
              </div>
            </div>

            <div class="flex flex-col gap-y-2" v-if="categories.length > 0">
              <span class="px-3 text-xs font-medium text-muted-foreground">Категории</span>

              <div class="flex flex-col gap-y-1">
                <Button
                  variant="secondary"
                  class=""
                  size="sm"
                  v-for="category in categories"
                  :key="category.id"
                  @click="uiStore.openCategoryToEdit(category)"
                >
                  <span class="text-sm truncate" :title="category.name">{{ category.name }}</span>
                  <span class="ms-auto text-xs text-muted-foreground">{{ category.name }}</span>
                </Button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col gap-y-1">
              <Skeleton class="rounded-md h-8" />
              <Skeleton class="rounded-md h-8" />
              <Skeleton class="rounded-md h-8" />
              <span class="sr-only">Загрузка...</span>
            </div>
          </template>
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
</template>
