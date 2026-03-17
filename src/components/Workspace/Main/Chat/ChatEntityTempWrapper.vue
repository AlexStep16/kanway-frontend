<script setup lang="ts" generic="T">
import DeletedEntity from '@/components/Workspace/Main/DeletedEntity.vue'

const props = defineProps<{
  entity: T & { id: string }
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

function handleToggleSelect() {
  if (selectedIds.value.includes(props.entity.id)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== props.entity.id)
  } else {
    selectedIds.value.push(props.entity.id)
  }
}
</script>

<template>
  <template v-if="entity">
    <slot name="default" :entity="entity" :toggle-select="handleToggleSelect"></slot>
  </template>

  <template v-else>
    <slot name="deleted">
      <DeletedEntity />
    </slot>
  </template>
</template>
