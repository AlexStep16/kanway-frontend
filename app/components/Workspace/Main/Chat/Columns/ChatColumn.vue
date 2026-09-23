<script setup lang="ts">
import ChatEntityWrapper from '../ChatEntityWrapper.vue'
import EntityCardSkeleton from '../../EntityCardSkeleton.vue'
import type { IColumn } from '~/interfaces/domain/IColumn'
import ColumnCard from '../../Column/ColumnCard.vue'

const props = defineProps<{
  column: IColumn
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const { data, isPending } = useColumn(props.column.id, props.column.board?.id)
</script>

<template>
  <ChatEntityWrapper
    :data="data"
    :is-pending="isPending"
    :entity-id="column.id"
    :has-checkbox="hasCheckbox"
    v-model:selected-ids="selectedIds"
  >
    <template #default="{ entity, hasCheckbox, selectedIds, toggleSelect }">
      <ColumnCard
        :column="entity"
        :options="{
          isChat: true,
          hasBorder: true,
          hasCheckbox: hasCheckbox,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        @toggleSelect="toggleSelect"
        classes="self-start"
      />
    </template>

    <template #skeleton>
      <EntityCardSkeleton />
    </template>
  </ChatEntityWrapper>
</template>
