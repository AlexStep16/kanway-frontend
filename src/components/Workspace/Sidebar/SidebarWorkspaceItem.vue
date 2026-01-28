<script setup lang="ts">
import { computed, ref } from 'vue'
import Options from '@/components/Options/Options.vue'
import WorkspaceModel from '@/models/WorkspaceModel'
import { useWorkspaceMutationStatus } from '@/composables/workspaces/mutations/useWorkspaceMutationStatus'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'
import SidebarBaseItem from './SidebarBaseItem.vue'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import EditForm from '@components/Options/EditForm.vue'
import WorkspaceEditWrapper from '@/components/Forms/CreateEditWorkspace/Wrapper.vue'
import { Nullable } from '@/types/utils'
import { useArchiveWorkspace } from '@/composables/workspaces/mutations/useArchiveWorkspace'
import { useCloneWorkspace } from '@/composables/workspaces/mutations/useCloneWorkspace'
import { useUpdateWorkspace } from '@/composables/workspaces/mutations/useUpdateWorkspace'

const workspaceStore = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)

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

const workspaceEditWrapperRef = ref<Nullable<InstanceType<typeof WorkspaceEditWrapper>>>(null)

const getFirstLetterOfWorkspace = computed(() => (workspaceId: string) => {
  const workspace = workspaces.value.find((ws) => ws.id === workspaceId)

  if (workspace) return workspace.name.charAt(0).toUpperCase()

  return ''
})

function resetWorkspaceForm() {
  if (workspaceEditWrapperRef.value && workspaceEditWrapperRef.value.resetForm) {
    workspaceEditWrapperRef.value.resetForm()
  }
}

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
</script>

<template>
  <SidebarBaseItem :name="item.name" :selected="selected" @select="$emit('select')">
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
          favorite: true,
          archive: true,
        }"
        :status="expandedStatus"
        :item="item"
        class="absolute right-2.5"
        :resetForm="resetWorkspaceForm"
        groupName="sidebar-item"
        :hoverClass="selected ? 'lg:hover:bg-blue-200' : 'lg:hover:bg-gray-200'"
        @archive="handleArchive"
        @copy="handleCopy"
        @favorite="handleFavorite"
      >
        <template #edit-content="{ closeDropdown, close }">
          <EditForm @closeEdit="close" title="Редактирование пространства">
            <WorkspaceEditWrapper
              @workspaceCreated="closeDropdown"
              @workspaceEdited="closeDropdown"
              mode="edit"
              :item="item"
              ref="workspaceEditWrapperRef"
            />
          </EditForm>
        </template>
      </Options>
    </template>
  </SidebarBaseItem>
</template>
