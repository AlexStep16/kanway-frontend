<script setup lang="ts" generic="T">
import { ref, watch } from 'vue'
import _ from 'lodash'
import DeletedEntity from '@/components/Workspace/Main/DeletedEntity.vue'

const props = defineProps<{
  data: T | null | undefined
  isPending: boolean
  entityId: string
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const dataCopy = ref<T | null | undefined>(null)

function handleToggleSelect() {
  if (selectedIds.value.includes(props.entityId)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== props.entityId)
  } else {
    selectedIds.value = [...selectedIds.value, props.entityId]
  }
}

watch(
  () => props.data,
  (newData) => {
    dataCopy.value = newData ? _.cloneDeep(newData) : null
  },
  { immediate: true },
)
</script>

<template>
  <template v-if="props.isPending">
    <slot name="skeleton"></slot>
  </template>

  <template v-else-if="dataCopy">
    <slot
      name="default"
      :entity="dataCopy"
      :has-checkbox="hasCheckbox"
      :selected-ids="selectedIds"
      :toggle-select="handleToggleSelect"
    ></slot>
  </template>

  <template v-else>
    <slot name="deleted">
      <DeletedEntity />
    </slot>
  </template>
</template>
