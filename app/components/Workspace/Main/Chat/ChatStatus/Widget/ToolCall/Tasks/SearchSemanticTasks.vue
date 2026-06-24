<script setup lang="ts">
import ChatTasksView from '~/components/Workspace/Main/Chat/Tasks/ChatTasksView.vue'
import type { ISearchSemanticEntitiesContent } from '~/interfaces/Statuses/Content/ISearchSemanticEntitiesContent'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import SearchSemanticEntities from '../Base/SearchSemantic/SearchSemanticEntities.vue'

const props = defineProps<{
  state: StatusStatesEnum
  content: ISearchSemanticEntitiesContent
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <SearchSemanticEntities
    :state="props.state"
    :content="props.content"
    :state-classes="props.stateClasses"
    :noun-titles-completed="['задача', 'задачи', 'задач']"
    :view-component="ChatTasksView"
  />
</template>
