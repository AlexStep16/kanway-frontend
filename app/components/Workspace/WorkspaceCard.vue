<script setup lang="ts">
import EntityCard, { type EntityCardOptions } from './Main/EntityCard.vue'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'

const props = defineProps<{
  workspace: IWorkspace
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

// --- Mutations ---
const { mutate: archiveWorkspace } = useArchiveWorkspace()
const { mutate: cloneWorkspace } = useCloneWorkspace()

const status = useWorkspaceMutationStatus(computed(() => props.workspace.id))

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
    @copy="handleCopy"
    @archive="handleArchive"
  >
    <slot />
  </EntityCard>
</template>
