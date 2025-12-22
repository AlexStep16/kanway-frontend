<script setup lang="ts">
import { useUIStore } from '@stores/ui'
import ActionAndCloseButtons from '@components/Workspace/Main/EditEntity/ActionAndCloseButtons.vue'
import { computed, nextTick, toRef, watch } from 'vue'
import { ref } from 'vue'
import { Nullable } from '@/types/utils'
import { HSStaticMethods } from 'preline'
import _ from 'lodash'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import EntityCard from '@components/Workspace/Main/EntityCard.vue'
import ColumnsView from '@components/Workspace/Main/ColumnsView.vue'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import { useAuthStore } from '@stores/auth'
import { User } from 'lucide-vue-next'
import TitleWithBadge from '@components/Workspace/Main/TitleWithBadge.vue'

const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()
const UI_STORE = useUIStore()
const AUTH_STORE = useAuthStore()

const user = toRef(AUTH_STORE, 'user')

const editableWorkspace = ref<Nullable<IWorkspace>>(null)
const textareaNameAutoHeight = ref<Nullable<HTMLTextAreaElement>>(null)
const updateNameTimeout = ref<Nullable<number>>(null)
const boardsContainerRef = ref<HTMLElement | null>(null)

async function copyWorkspace(workspace: IWorkspace) {
  await WORKSPACE_STORE.cloneWorkspace(workspace)

  UI_STORE.closeEditWorkspaceModal()
}

async function archiveWorkspace(workspace: IWorkspace) {
  await WORKSPACE_STORE.archiveWorkspace(workspace)

  UI_STORE.closeEditWorkspaceModal()
}

function updateWorkspace(updatedFields: ISingleUpdate<IWorkspace>) {
  if (!editableWorkspace.value) return

  WORKSPACE_STORE.updateWorkspace(updatedFields, true)
}

function nameInput() {
  if (updateNameTimeout.value) {
    clearTimeout(updateNameTimeout.value)
  }

  updateNameTimeout.value = window.setTimeout(() => {
    if (!editableWorkspace.value || !editableWorkspace.value.name) return

    updateWorkspace({
      id: editableWorkspace.value.id,
      name: editableWorkspace.value.name,
    })

    updateNameTimeout.value = null
  }, 500)
}

const isWorkspaceCopying = computed(() => {
  if (!editableWorkspace.value) return false

  return WORKSPACE_STORE.isWorkspaceCloning(editableWorkspace.value.id)
})

const isWorkspaceArchiving = computed(() => {
  if (!editableWorkspace.value) return false

  return WORKSPACE_STORE.isWorkspaceArchiving(editableWorkspace.value.id)
})

function initializeTextarea(textarea: Nullable<HTMLTextAreaElement>) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

const getBoards = computed(() => {
  if (!editableWorkspace.value) return []

  if (editableWorkspace.value.isDeleted)
    return BOARD_STORE.getAllBoardsByWorkspaceId(editableWorkspace.value.id)
  console.log(BOARD_STORE.getBoardsByWorkspaceId(editableWorkspace.value.id))
  return BOARD_STORE.getBoardsByWorkspaceId(editableWorkspace.value.id)
})

watch(
  () => WORKSPACE_STORE.workspaceToEdit,
  (newWorkspace) => {
    if (newWorkspace && newWorkspace.id === editableWorkspace.value?.id) return

    const shouldInitialize = newWorkspace && !editableWorkspace.value

    if (newWorkspace) {
      editableWorkspace.value = _.cloneDeep(newWorkspace)
    } else {
      editableWorkspace.value = null
    }

    nextTick(() => {
      if (shouldInitialize) {
        HSStaticMethods.autoInit()
      }

      initializeTextarea(textareaNameAutoHeight.value)
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div
    id="hs-workspace-edit"
    :ref="
      (el) => {
        if (el) UI_STORE.editWorkspaceModalRef = el as HTMLElement
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
          <div class="flex items-center gap-x-1 min-w-0">
            <MoveDropdownButton :title="user?.username || ''" :disabled="true">
              <User class="size-4 shrink-0" />
            </MoveDropdownButton>
          </div>

          <ActionAndCloseButtons
            :editableEntity="editableWorkspace"
            :isEntityCopying="isWorkspaceCopying"
            :isEntityArchiving="isWorkspaceArchiving"
            @copy="copyWorkspace"
            @archive="archiveWorkspace"
            @close="UI_STORE.closeEditWorkspaceModal()"
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
              @input="nameInput"
              ref="textareaNameAutoHeight"
              rows="1"
              v-model="editableWorkspace.name"
            ></textarea>
          </div>
          <!-- End Textarea -->
        </div>

        <div class="flex flex-col gap-y-2 px-4 pb-4 mt-4 items-start overflow-hidden">
          <TitleWithBadge title="Доски" :number="getBoards.length" />

          <div
            class="flex gap-2 flex-wrap w-full min-h-0 pb-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
            ref="boardsContainerRef"
            v-if="getBoards.length > 0"
          >
            <ColumnsView :items="getBoards" :containerRef="boardsContainerRef">
              <template v-slot:default="slotProps">
                <EntityCard
                  v-for="board in slotProps.data"
                  :key="board.id"
                  :name="board.name"
                  :isStatic="false"
                  :hasCopy="true"
                  :isCopying="BOARD_STORE.isBoardCloning(board.id)"
                  :isDeleted="board.isDeleted"
                  :hasDelete="true"
                  :isArchiving="BOARD_STORE.isBoardArchiving(board.id)"
                  @click="BOARD_STORE.openBoardToEdit(board)"
                />
              </template>
            </ColumnsView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
