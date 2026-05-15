<script setup lang="ts">
import { computed } from 'vue'
import { FolderKanban } from 'lucide-vue-next'
import type { IParent } from '~/interfaces/IParent'

const props = defineProps<{
  beforeWorkspace: IParent
  afterWorkspace: IParent
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const isBeforeWorkspaceExists = computed(() => {
  return typeof props.beforeWorkspace !== 'string'
})

const hasWorkspaceChange = computed(() => {
  if (!isBeforeWorkspaceExists.value) {
    return true
  } else {
    return (props.beforeWorkspace as IParent).id !== (props.afterWorkspace as IParent).id
  }
})
</script>

<template>
  <div class="flex items-center gap-x-1" v-if="hasWorkspaceChange">
    <div class="flex items-center gap-x-1" :class="baseBlockBeforeClasses" v-if="beforeWorkspace">
      <FolderKanban class="size-3 shrink-0" />
      <span class="text-xs" v-if="isBeforeWorkspaceExists">{{
        (beforeWorkspace as IParent).name
      }}</span>
      <span class="text-xs" v-else>Удалено</span>
    </div>
    <div class="flex items-center gap-x-1" :class="baseBlockAfterClasses">
      <FolderKanban class="size-3 shrink-0" />
      <span class="text-xs">{{ afterWorkspace.name }}</span>
    </div>
  </div>
</template>
