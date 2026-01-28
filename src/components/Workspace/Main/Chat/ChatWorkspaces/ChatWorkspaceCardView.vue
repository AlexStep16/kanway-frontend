<script setup lang="ts">
import { computed, ref } from 'vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import ChatWorkspace from '@/components/Workspace/Main/Chat/ChatWorkspaces/ChatWorkspace.vue'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import ChatWorkspaceStatic from './ChatWorkspaceStatic.vue'

const props = defineProps<{
  message: {
    id: string
  }
  entities?: (IWorkspace & { isSelected?: boolean; tempId: string })[]
}>()

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

function handleToggleSelect(workspaceId: string) {
  const realWorkspaceProp = props.entities?.find((t) => t.id === workspaceId)
  const tempWorkspaceProp = props.entities?.find((t) => t.tempId === workspaceId)

  const workspaceProp = realWorkspaceProp || tempWorkspaceProp

  if (workspaceProp) {
    workspaceProp.isSelected = !workspaceProp.isSelected
  }
}

const staticWorkspaces = computed(() => props.entities?.filter((workspace) => !workspace.id) || [])
const realWorkspaces = computed(() => props.entities?.filter((workspace) => workspace.id) || [])
</script>

<template>
  <div
    class="flex gap-2 mt-3 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement
      }
    "
    v-if="entities && entities.length > 0"
  >
    <ColumnsView
      :items="realWorkspaces"
      :containerRef="messagesContainerRefMap[message.id]"
      v-if="realWorkspaces && realWorkspaces.length > 0"
    >
      <template v-slot:default="slotProps">
        <ChatWorkspace
          v-for="item in slotProps.data"
          :key="item.id"
          :workspace="item"
          @toggle-select="handleToggleSelect"
        />
      </template>
    </ColumnsView>

    <ColumnsView
      :items="staticWorkspaces"
      :containerRef="messagesContainerRefMap[message.id]"
      v-if="staticWorkspaces && staticWorkspaces.length > 0"
    >
      <template v-slot:default="slotProps">
        <ChatWorkspaceStatic
          v-for="item in slotProps.data"
          :key="item.id"
          :workspace="item"
          @toggle-select="handleToggleSelect"
        />
      </template>
    </ColumnsView>
  </div>
</template>
