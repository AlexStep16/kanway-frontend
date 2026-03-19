<script setup lang="ts">
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import ChatCategoriesView from './Categories/ChatCategoriesView.vue'
import ChatBoardsView from './Boards/ChatBoardsView.vue'
import ChatWorkspacesView from './Workspaces/ChatWorkspacesView.vue'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import ChatTask from './Tasks/ChatTask.vue'

const props = defineProps<{
  message: Omit<IChatMessage, 'content'> & {
    content: {
      entityType: 'task' | 'category' | 'board' | 'workspace'
      entities: any[]
    }
  }
}>()
</script>

<template>
  <AIBubble :isContentFullWidth="true">
    <template v-if="message.content.entityType === 'task'">
      <ChatTask v-for="entity in message.content.entities" :key="entity.id" :task="entity" />
    </template>
    <ChatCategoriesView
      v-else-if="message.content.entityType === 'category'"
      :message="message"
      :items="message.content.entities"
    />
    <ChatBoardsView
      v-else-if="message.content.entityType === 'board'"
      :message="message"
      :items="message.content.entities"
    />
    <ChatWorkspacesView
      v-else-if="message.content.entityType === 'workspace'"
      :message="message"
      :items="message.content.entities"
    />
  </AIBubble>
</template>
