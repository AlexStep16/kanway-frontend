<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { Plus } from 'lucide-vue-next'

import { useBoardStore } from '@stores/board'
import { useWorkspaceStore } from '@stores/workspace'

import { ICategoryState } from '@stores/interfaces/ICategoryState'

import { useCategories } from '@/composables/categories/queries/useCategories'
import { useBoards } from '@/composables/boards/queries/useBoards'

import Category from '@components/Workspace/Main/Category/Category.vue'
import CategorySkeleton from '@components/Workspace/Main/Category/CategorySkeleton.vue'
import CreateCategoryForm from '@/components/Forms/CreateCategoryForm.vue'
import { useMoveCategoryCard } from '@/composables/categories/mutations/useMoveCategoryCard'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import TitleBoard from '../../Header/TitleBoard.vue'
import SidebarInset from '@/components/ui/sidebar/SidebarInset.vue'
import Search from '../../Header/Search.vue'

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { data: categories, isPending: areCategoriesLoading } = useCategories(activeBoardId)
const { isPending: isBoardsLoading } = useBoards(activeWorkspaceId)

const { mutate: moveCategory } = useMoveCategoryCard()

const localCategoryList = ref<ICategoryState[]>([])
const isCategoryFormShown = ref(false)

watch(
  () => categories.value,
  (newList) => {
    if (!newList) return

    localCategoryList.value = [...newList].sort((a, b) => a.rank.localeCompare(b.rank))
  },
  { immediate: true },
)

function draggableChange(event: any) {
  if (!event.moved && !event.added) return

  const movedTask = event.moved ? event.moved.element : event.added.element
  const newIndex = event.moved ? event.moved.newIndex : event.added.newIndex

  const beforeCategory = localCategoryList.value[newIndex + 1]
  const afterCategory = localCategoryList.value[newIndex - 1]

  const beforeId = beforeCategory ? beforeCategory.id : null
  const afterId = afterCategory ? afterCategory.id : null

  moveCategory({
    id: movedTask.id,
    beforeId,
    afterId,
    boardId: activeBoardId.value,
  })
}
</script>

<template>
  <SidebarInset>
    <header class="flex justify-between h-16 shrink-0 items-center gap-2 px-4">
      <div class="flex items-center gap-2">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-0 data-[orientation=vertical]:h-4" />
        <TitleBoard />
      </div>
      <Search />
    </header>

    <Separator />

    <div class="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-y-auto">
      <div class="size-full pt-4 flex gap-3 overflow-y-hidden custom-scrollbar">
        <template v-if="!isBoardsLoading">
          <draggable
            v-model="localCategoryList"
            @change="draggableChange"
            itemKey="id"
            class="flex gap-x-3 h-full items-start"
            group="categories"
            :animation="150"
            :delay="300"
            :delay-on-touch-only="true"
            ghost-class="ghost-class"
            drag-class="drag-class"
            filter=".undraggable"
            :force-fallback="true"
            :fallback-tolerance="2"
            v-if="localCategoryList.length > 0 && !areCategoriesLoading"
          >
            <template #item="{ element }">
              <Category :category="element" />
            </template>
          </draggable>

          <template v-else-if="areCategoriesLoading">
            <CategorySkeleton v-for="n in 3" :key="'skeleton' + n" />
          </template>

          <CreateCategoryForm
            v-if="isCategoryFormShown && activeBoardId && activeWorkspaceId"
            @close="isCategoryFormShown = false"
            :boardId="activeBoardId"
            :workspaceId="activeWorkspaceId"
          />

          <div class="h-full flex items-center pr-10">
            <button
              type="button"
              class="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-200 transition-colors focus:outline-hidden"
              @click="isCategoryFormShown = true"
            >
              <Plus class="size-6" />
            </button>
          </div>
        </template>

        <template v-else>
          <CategorySkeleton v-for="n in 3" :key="'skeleton' + n" />
          <div class="h-full flex items-center">
            <div class="size-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </template>
      </div>
    </div>
  </SidebarInset>
</template>

<style lang="css" scoped>
.ghost-class {
  opacity: 0;
}

.drag-class {
  transform: scale(1.02);
  opacity: 1 !important;
  cursor: grabbing;
  z-index: 9999;
}
</style>
