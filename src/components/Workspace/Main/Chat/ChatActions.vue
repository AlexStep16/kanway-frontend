<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { IActionResponse } from '@/interfaces/IActionResponse'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'

import ChatTasksView from './ChatTasks/ChatTasksView.vue'
import ChatBoardCardView from './ChatBoards/ChatBoardCardView.vue'
import ChatCategoryCardView from './ChatCategories/ChatCategoryCardView.vue'
import ChatWorkspaceCardView from './ChatWorkspaces/ChatWorkspaceCardView.vue'

const props = defineProps<{
  message: {
    id: string
    content: IActionResponse
  }
}>()

const ENTITY_CONFIG = {
  tasks: {
    component: markRaw(ChatTasksView),
    labels: { nom: 'задачи', gen: 'задач' },
  },
  categories: {
    component: markRaw(ChatCategoryCardView),
    labels: { nom: 'категории', gen: 'категорий' },
  },
  boards: {
    component: markRaw(ChatBoardCardView),
    labels: { nom: 'доски', gen: 'досок' },
  },
  workspaces: {
    component: markRaw(ChatWorkspaceCardView),
    labels: { nom: 'пространства', gen: 'пространств' },
  },
} as const

const ACTION_VERBS: Record<string, string> = {
  archive: 'архивированы',
  recover: 'восстановлены',
  delete: 'удалены',
  edit: 'обновлены',
  create: 'созданы',
  clone: 'скопированы',
}

const renderBlocks = computed(() => {
  const content = props.message.content
  const blocks = []

  for (const [actionKey, entities] of Object.entries(content)) {
    if (!entities) continue

    for (const [entityKey, items] of Object.entries(entities)) {
      const config = ENTITY_CONFIG[entityKey as keyof typeof ENTITY_CONFIG]
      if (!config || !items || (Array.isArray(items) && items.length === 0)) continue

      let title = ''

      if (actionKey === 'list') {
        title = `Вот список ${config.labels.gen} по вашему запросу:`
      } else {
        const verb = ACTION_VERBS[actionKey] || actionKey
        title = `Были ${verb} следующие ${config.labels.nom}:`
      }

      blocks.push({
        id: `${props.message.id}-${actionKey}-${entityKey}`,
        title,
        items: items as any[],
        component: config.component,
      })
    }
  }

  return blocks
})
</script>

<template>
  <AIBubble :hideAvatar="true" :isContentFullWidth="true">
    <div v-for="block in renderBlocks" :key="block.id" class="mb-4 last:mb-0">
      <Assistant :text="block.title" />

      <component
        :is="block.component"
        :message="message"
        :tasks="block.items"
        :entities="block.items"
      />
    </div>
  </AIBubble>
</template>
