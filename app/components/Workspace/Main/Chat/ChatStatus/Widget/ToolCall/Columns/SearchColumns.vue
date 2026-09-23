<script setup lang="ts">
import ChatColumnsView from '~/components/Workspace/Main/Chat/Columns/ChatColumnsView.vue'
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
    noun-titles-processing="колонки"
    :noun-titles-completed="['колонка', 'колонки', 'колонок']"
    :view-component="ChatColumnsView"
  />
</template>
