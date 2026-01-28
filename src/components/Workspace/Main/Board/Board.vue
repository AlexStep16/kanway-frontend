<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { Plus } from 'lucide-vue-next'

import { useBoardStore } from '@stores/board'
import { useWorkspaceStore } from '@stores/workspace'

import { ICategoryState } from '@stores/interfaces/ICategoryState'

import { useCategories } from '@/composables/categories/queries/useCategories'
import { useUpdateManyCategories } from '@/composables/categories/mutations/useUpdateManyCategories'
import { useBoards } from '@/composables/boards/queries/useBoards'

import Header from '@components/Workspace/Header/Header.vue'
import Category from '@components/Workspace/Main/Category/Category.vue'
import AIInput from '@components/Workspace/Main/AIInput.vue'
import CategorySkeleton from '@components/Workspace/Main/Category/CategorySkeleton.vue'
import CreateCategoryForm from '@/components/Forms/CreateCategoryForm.vue'

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { data: categories, isPending: areCategoriesLoading } = useCategories(activeBoardId)
const { isPending: isBoardsLoading } = useBoards(activeWorkspaceId)

const { mutate: updateManyCategories } = useUpdateManyCategories()

const localCategoryList = ref<ICategoryState[]>([])
const isCategoryFormShown = ref(false)

watch(
  () => categories.value,
  (newList) => {
    if (!newList) return

    localCategoryList.value = [...newList].sort((a, b) => a.order - b.order)
  },
  { immediate: true },
)

function handleSortChange() {
  if (!activeBoardId.value || !activeWorkspaceId.value) return

  const payload = localCategoryList.value.map((category, index) => ({
    id: category.id,
    order: index + 1,
  }))

  updateManyCategories({
    payload,
  })
}
</script>

<template>
  <Header />

  <div class="size-full py-1.5 flex gap-3 overflow-y-hidden custom-scrollbar">
    <template v-if="!isBoardsLoading">
      <draggable
        v-model="localCategoryList"
        @change="handleSortChange"
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
        v-if="isCategoryFormShown"
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

  <AIInput />
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
