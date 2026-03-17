<script setup lang="ts">
import { useUIStore } from '@stores/ui'
import ActionAndCloseButtons from '@components/Workspace/Main/EditEntity/ActionAndCloseButtons.vue'
import { computed, nextTick, watch } from 'vue'
import { ref } from 'vue'
import { Nullable } from '@/types/utils'
import { HSStaticMethods } from 'preline'
import EntityCard from '@components/Workspace/Main/EntityCard.vue'
import ColumnsView from '@components/Workspace/Main/ColumnsView.vue'
import TitleWithBadge from '@components/Workspace/Main/TitleWithBadge.vue'
import { useWorkspace } from '@/composables/workspaces/useWorkspace'
import { storeToRefs } from 'pinia'
import { useUpdateWorkspace } from '@/composables/workspaces/mutations/useUpdateWorkspace'
import { useArchiveWorkspace } from '@/composables/workspaces/mutations/useArchiveWorkspace'
import { useCloneWorkspace } from '@/composables/workspaces/mutations/useCloneWorkspace'
import { useDebounceFn } from '@vueuse/core'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useArchivedBoards } from '@/composables/boards/queries/useArchivedBoards'
import { useWorkspaceMutationStatus } from '@/composables/workspaces/mutations/useWorkspaceMutationStatus'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'
import EntityCardSkeleton from '@components/Workspace/Main/EntityCardSkeleton.vue'
import { useArchivedWorkspace } from '@/composables/workspaces/useArchivedWorkspace'

const uiStore = useUIStore()

const { editableWorkspaceId, isEditableWorkspaceDeleted } = storeToRefs(uiStore)

const liveWorkspace = useWorkspace(
  editableWorkspaceId,
  computed(() => !isEditableWorkspaceDeleted.value),
)
const archivedWorkspace = useArchivedWorkspace(
  editableWorkspaceId,
  computed(() => isEditableWorkspaceDeleted.value),
)

const editableWorkspace = computed(() => {
  return isEditableWorkspaceDeleted.value ? archivedWorkspace.value : liveWorkspace.value
})

const { data: actualBoards, isPending: areBoardsLoading } = useBoards(editableWorkspaceId)
const { data: archivedBoards, isPending: areArchivedBoardsLoading } = useArchivedBoards(
  computed(() => editableWorkspace.value?.isDeleted ?? false),
)

const { mutate: updateWorkspace } = useUpdateWorkspace()
const { mutate: archiveWorkspace } = useArchiveWorkspace()
const { mutate: copyWorkspace } = useCloneWorkspace()

const status = useWorkspaceMutationStatus(editableWorkspaceId)

const localWorkspaceId = ref<string | null>(null)
const name = ref<string>('')

const textareaNameAutoHeight = ref<Nullable<HTMLTextAreaElement>>(null)
const boardsContainerRef = ref<HTMLElement | null>(null)

function nameInput() {
  if (!editableWorkspace.value || !editableWorkspace.value.name) return

  updateWorkspace({
    payload: {
      id: editableWorkspace.value.id,
      name: editableWorkspace.value.name,
    },
  })
}

const debouncedNameInput = useDebounceFn(nameInput, 500)

function initializeTextarea(textarea: Nullable<HTMLTextAreaElement>) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

function handleCopyWorkspace() {
  if (!editableWorkspace.value) return

  copyWorkspace({
    id: editableWorkspace.value.id,
  })
}

function handleArchiveWorkspace() {
  if (!editableWorkspace.value) return

  archiveWorkspace({
    workspace: editableWorkspace.value,
  })
}

const boards = computed(() => {
  if (editableWorkspace.value?.isDeleted) {
    return archivedBoards.value || []
  } else {
    return actualBoards.value || []
  }
})

const areCurrentBoardsLoading = computed(() => {
  return editableWorkspace.value?.isDeleted
    ? areArchivedBoardsLoading.value
    : areBoardsLoading.value
})

const getBoardStatus = computed(() => (id: string) => {
  return useBoardMutationStatus(id)
})

watch(
  () => editableWorkspace.value,
  (newWorkspace) => {
    if (newWorkspace && newWorkspace.id === localWorkspaceId.value) return

    const shouldInitialize = newWorkspace && !localWorkspaceId.value

    if (newWorkspace) {
      localWorkspaceId.value = newWorkspace.id
      name.value = newWorkspace.name
    } else {
      localWorkspaceId.value = null
      name.value = ''
    }

    nextTick(() => {
      if (shouldInitialize) {
        HSStaticMethods.autoInit()
      }

      initializeTextarea(textareaNameAutoHeight.value)
    })
  },
  { immediate: true },
)
</script>

<template>
  <div
    id="hs-workspace-edit"
    :ref="
      (el) => {
        if (el) uiStore.editWorkspaceModalRef = el as HTMLElement
      }
    "
    class="hs-overlay [--overlay-backdrop:static] hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-85 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-category-edit-label"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex flex-col w-full max-h-150 max-w-xl bg-white rounded-md pointer-events-auto"
        v-if="editableWorkspace"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <ActionAndCloseButtons
            :editableEntity="editableWorkspace"
            :isEntityCopying="status.isCloning?.value"
            :isEntityArchiving="status.isArchiving?.value"
            @copy="handleCopyWorkspace"
            @archive="handleArchiveWorkspace"
            @close="uiStore.closeEditWorkspaceModal()"
          />
        </div>
        <!-- Header End -->

        <div class="flex items-start px-4 pt-2">
          <!-- Textarea -->
          <div class="flex items-center w-full">
            <textarea
              class="p-0 block w-full text-black border-none focus:ring-0 text-lg disabled:opacity-50 disabled:pointer-events-none resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
              placeholder="Имя пространства"
              data-hs-textarea-auto-height
              @input="debouncedNameInput"
              ref="textareaNameAutoHeight"
              rows="1"
              v-model="editableWorkspace.name"
            ></textarea>
          </div>
          <!-- End Textarea -->
        </div>

        <div class="flex flex-col gap-y-2 px-4 pb-4 mt-4 items-start overflow-hidden">
          <TitleWithBadge
            title="Доски"
            :number="boards.length"
            :isLoading="areCurrentBoardsLoading"
          />

          <div
            class="flex gap-2 flex-wrap w-full min-h-0 pb-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
            ref="boardsContainerRef"
            v-if="boards.length > 0"
          >
            <ColumnsView
              :items="boards"
              :containerRef="boardsContainerRef"
              v-if="!areCurrentBoardsLoading"
            >
              <template v-slot:default="slotProps">
                <EntityCard
                  v-for="board in slotProps.data"
                  :id="board.id"
                  :key="board.id"
                  :entity="board"
                  :options="{
                    hasCopy: true,
                    hasDelete: true,
                  }"
                  :status="status"
                  @click="uiStore.openBoardToEdit(board)"
                />
              </template>
            </ColumnsView>

            <EntityCardSkeleton v-for="i in 5" :key="`entity-card-skeleton-${i}`" v-else />

            <div v-if="boards.length === 0" class="text-center py-10 text-gray-400 text-sm">
              Нет досок
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
