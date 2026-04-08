<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import EntityCard, { EntityCardOptions } from './Main/EntityCard.vue'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { useArchiveWorkspace } from '@/composables/workspaces/mutations/useArchiveWorkspace'
import { useCloneWorkspace } from '@/composables/workspaces/mutations/useCloneWorkspace'
import { useWorkspaceMutationStatus } from '@/composables/workspaces/mutations/useWorkspaceMutationStatus'

const props = defineProps<{
  workspace: IWorkspace
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

const uiStore = useUIStore()

// --- Mutations ---
const { mutate: archiveWorkspace } = useArchiveWorkspace()
const { mutate: cloneWorkspace } = useCloneWorkspace()

const status = useWorkspaceMutationStatus(computed(() => props.workspace.id))

function handleEdit() {
  if (props.options?.isStatic) return

  uiStore.openWorkspaceToEdit(props.workspace)
}

function handleCopy() {
  if (props.options?.isStatic) return

  cloneWorkspace({ id: props.workspace.id })
}

function handleArchive() {
  if (props.options?.isStatic) return

  archiveWorkspace({ workspace: props.workspace })
}
</script>

<template>
  <EntityCard
    :entity="{
      ...workspace,
      color: undefined,
    }"
    :options="options"
    :classes="classes"
    :selected-ids="selectedIds"
    :status="status"
    @edit="handleEdit"
    @copy="handleCopy"
    @archive="handleArchive"
  >
    <slot />
  </EntityCard>
</template>
