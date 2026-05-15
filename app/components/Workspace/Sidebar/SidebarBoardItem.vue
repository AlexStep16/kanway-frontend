<script setup lang="ts">
import Options from '~/components/Options/Options.vue'
import SidebarBaseItem from './SidebarBaseItem.vue'
import BoardModel from '~/models/BoardModel'
import TransferForm from '~/components/Options/TransferForm.vue'

const boardStore = useBoardStore()

const activeBoardId = computed(() => boardStore.activeBoardId)

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

const { data: workspacesData } = useWorkspaces()

const workspaces = computed(() => workspacesData.value || [])

const selected = computed(() => {
  return props.item.id === activeBoardId.value
})

const otherWorkspaces = computed(() => {
  return workspaces.value.filter((ws) => ws.id !== props.item.workspace.id)
})

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
  <SidebarBaseItem
    :name="item.name"
    :selected="selected"
    @select="$emit('select')"
  >
    <template #options>
      <Options
        :options="{
          edit: false,
          copy: true,
          move: true,
          favorite: true,
          archive: true,
        }"
        :status="expandedStatus"
        :item="item"
        class="absolute right-2.5"
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
      </Options>
    </template>
  </SidebarBaseItem>
</template>
