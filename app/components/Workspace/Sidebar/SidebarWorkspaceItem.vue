<script setup lang="ts">
import Options from '~/components/Options/Options.vue'
import WorkspaceModel from '~/models/WorkspaceModel'
import { useWorkspaceStore } from '~/stores/workspace'
import SidebarBaseItem from './SidebarBaseItem.vue'

const workspaceStore = useWorkspaceStore()
const uiStore = useUIStore()

const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const { data: workspacesData } = useWorkspaces()

const workspaces = computed(() => workspacesData.value || [])

const { mutate: archiveWorkspace } = useArchiveWorkspace()
const { mutate: cloneWorkspace } = useCloneWorkspace()
const { mutate: makeFavorite, isPending: isFavoritePending } = useUpdateWorkspace()

const props = defineProps<{
  item: WorkspaceModel
}>()

defineEmits<{
  (e: 'select'): void
}>()

const getFirstLetterOfWorkspace = computed(() => (workspaceId: string) => {
  const workspace = workspaces.value.find((ws) => ws.id === workspaceId)

  if (workspace) return workspace.name.charAt(0).toUpperCase()

  return ''
})

const workspaceStatus = useWorkspaceMutationStatus(computed(() => props.item.id))

const selected = computed(() => {
  return props.item.id === activeWorkspaceId.value
})

function handleArchive() {
  archiveWorkspace({
    workspace: props.item,
  })
}

function handleCopy() {
  cloneWorkspace({
    id: props.item.id,
  })
}

function handleFavorite() {
  makeFavorite({
    payload: {
      id: props.item.id,
      isFavorite: !props.item.isFavorite,
    },
  })
}

const expandedStatus = computed(() => {
  return {
    ...workspaceStatus,
    isFavoritePending,
  }
})

function handleEdit() {
  uiStore.openWorkspaceDialog(props.item)
}
</script>

<template>
  <SidebarBaseItem
    :name="item.name"
    :selected="selected"
    @select="$emit('select')"
  >
    <template v-slot:link>
      <div
        class="size-5 me-2.5 rounded-sm text-xs flex items-center justify-center font-semibold text-white"
        :style="{ backgroundColor: item.color || '#3B82F6' }"
      >
        {{ getFirstLetterOfWorkspace(item.id) }}
      </div>
    </template>

    <template #options>
      <Options
        :options="{
          edit: true,
          favorite: true,
          archive: true,
        }"
        :status="expandedStatus"
        :item="item"
        class="absolute right-2.5"
        groupName="sidebar-item"
        :hoverClass="selected ? 'lg:hover:bg-blue-200' : 'lg:hover:bg-gray-200'"
        @edit="handleEdit"
        @archive="handleArchive"
        @copy="handleCopy"
        @favorite="handleFavorite"
      >
      </Options>
    </template>
  </SidebarBaseItem>
</template>
