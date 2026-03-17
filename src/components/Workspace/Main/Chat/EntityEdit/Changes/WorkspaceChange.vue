<script setup lang="ts">
import { computed } from 'vue'
import { FolderKanban } from 'lucide-vue-next'
import { IParent } from '@/interfaces/IParent'

const props = defineProps<{
  beforeWorkspace: IParent
  afterWorkspace: IParent
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasWorkspaceChange = computed(() => {
  return props.beforeWorkspace.id !== props.afterWorkspace.id
})
</script>

<template>
  <div class="flex items-center gap-x-1" v-if="hasWorkspaceChange">
    <div class="flex items-center gap-x-1" :class="baseBlockBeforeClasses" v-if="beforeWorkspace">
      <FolderKanban class="size-3" />
      <span class="text-xs">{{ beforeWorkspace.name }}</span>
    </div>
    <div class="flex items-center gap-x-1" :class="baseBlockAfterClasses">
      <FolderKanban class="size-3" />
      <span class="text-xs">{{ afterWorkspace.name }}</span>
    </div>
  </div>
</template>
