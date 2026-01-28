<script setup lang="ts">
import { computed, ref } from 'vue'
import Options from '@/components/Options/Options.vue'
import { storeToRefs } from 'pinia'
import SidebarBaseItem from './SidebarBaseItem.vue'
import { useBoardStore } from '@/stores/board'
import BoardModel from '@/models/BoardModel'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'
import TransferForm from '@/components/Options/TransferForm.vue'
import { useMoveBoard } from '@/composables/boards/mutations/useMoveBoard'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import EditForm from '@components/Options/EditForm.vue'
import BoardEditWrapper from '@/components/Forms/CreateEditBoard/Wrapper.vue'
import { Nullable } from '@/types/utils'
import { useArchiveBoard } from '@/composables/boards/mutations/useArchiveBoard'
import { useCloneBoard } from '@/composables/boards/mutations/useCloneBoard'
import { useUpdateBoard } from '@/composables/boards/mutations/useUpdateBoard'

const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const { mutate: moveBoard } = useMoveBoard()
const { mutate: archiveBoard } = useArchiveBoard()
const { mutate: cloneBoard } = useCloneBoard()
const { mutate: makeFavorite, isPending: isFavoritePending } = useUpdateBoard()

const props = defineProps<{
  item: BoardModel
}>()

defineEmits<{
  (e: 'select'): void
}>()

const boardStatus = useBoardMutationStatus(computed(() => props.item.id))
const boardEditWrapperRef = ref<Nullable<InstanceType<typeof BoardEditWrapper>>>(null)

const { data: workspacesData } = useWorkspaces()

const workspaces = computed(() => workspacesData.value || [])

const selected = computed(() => {
  return props.item.id === activeBoardId.value
})

const otherWorkspaces = computed(() => {
  return workspaces.value.filter((ws) => ws.id !== props.item.workspace.id)
})

function resetBoardForm() {
  if (boardEditWrapperRef.value && boardEditWrapperRef.value.resetForm) {
    boardEditWrapperRef.value.resetForm()
  }
}

function handleMove(newWorkspaceId: string) {
  moveBoard({
    payload: props.item,
    oldWorkspaceId: props.item.workspace.id,
    newWorkspaceId,
  })
}

function handleArchive() {
  archiveBoard({
    board: props.item,
  })
}

function handleCopy() {
  cloneBoard({
    id: props.item.id,
  })
}

function handleFavorite() {
  makeFavorite({
    payload: {
      id: props.item.id,
      isFavorite: !props.item.isFavorite,
    },
    workspaceId: props.item.workspace.id,
  })
}

const expandedStatus = computed(() => {
  return {
    ...boardStatus,
    isFavoritePending,
  }
})
</script>

<template>
  <SidebarBaseItem :name="item.name" :selected="selected" @select="$emit('select')">
    <template #options>
      <Options
        :options="{
          edit: true,
          copy: true,
          move: true,
          favorite: true,
          archive: true,
        }"
        :status="expandedStatus"
        :item="item"
        class="absolute right-2.5"
        :resetForm="resetBoardForm"
        groupName="sidebar-item"
        :hoverClass="selected ? 'lg:hover:bg-blue-200' : 'lg:hover:bg-gray-200'"
        @archive="handleArchive"
        @copy="handleCopy"
        @favorite="handleFavorite"
      >
        <template #transfer-content="{ close }">
          <TransferForm
            :items="otherWorkspaces"
            :isProcessing="boardStatus.isBusy"
            :isItemMoving="boardStatus.isMoving"
            :noItemsText="'Нет других пространств'"
            @close="close"
            @moveItem="handleMove"
          />
        </template>

        <template #edit-content="{ closeDropdown, close }">
          <EditForm @closeEdit="close" title="Редактирование доски">
            <BoardEditWrapper
              @boardCreated="closeDropdown"
              @boardEdited="closeDropdown"
              mode="edit"
              :item
              ref="boardEditWrapperRef"
            />
          </EditForm>
        </template>
      </Options>
    </template>
  </SidebarBaseItem>
</template>
