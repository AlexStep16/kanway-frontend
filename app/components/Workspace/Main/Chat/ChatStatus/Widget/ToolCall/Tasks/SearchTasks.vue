<script setup lang="ts">
import ChatTasksView from '~/components/Workspace/Main/Chat/Tasks/ChatTasksView.vue'
import type { ISearchEntitiesContent } from '~/interfaces/Statuses/Content/ISearchEntitiesContent'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import SearchEntities from '../Base/Search/SearchEntities.vue'

const props = defineProps<{
  state: StatusStatesEnum
  content: ISearchEntitiesContent
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <SearchEntities
    :state="props.state"
    :content="props.content"
    :state-classes="props.stateClasses"
    noun-titles-processing="задачи"
    :noun-titles-completed="['задача', 'задачи', 'задач']"
    :view-component="ChatTasksView"
  />
</template>
