<script setup lang="ts">
import ChatEntityTempWrapper from '../ChatEntityTempWrapper.vue'
import ColumnCard from '~/components/Workspace/Main/Column/ColumnCard.vue'
import type { IColumn } from '~/interfaces/domain/IColumn'

const props = defineProps<{
  column: IColumn
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})
</script>

<template>
  <ChatEntityTempWrapper
    :entity="column"
    v-model:selected-ids="selectedIds"
  >
    <template #default="{ entity }">
      <ColumnCard
        :column="entity"
        :options="{
          hasBorder: true,
          hasCheckbox: hasCheckbox,
          isStatic: true,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        classes="self-start"
      />
    </template>
  </ChatEntityTempWrapper>
</template>
