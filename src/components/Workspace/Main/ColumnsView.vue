<script setup lang="ts">
import { computed, watch } from 'vue'
import { ref } from 'vue'
import { generateUUID } from '@utils/idGenerator'

const props = defineProps<{
  items: Array<any>
  containerRef: HTMLElement | null
}>()

const currentAvailableColumns = ref(0)

const columns = computed(() => {
  if (!currentAvailableColumns.value) return []

  const result: any = Array.from({ length: currentAvailableColumns.value }, () => [])

  props.items.forEach((item, index) => {
    result[index % currentAvailableColumns.value].push(item)
  })
  return result
})

function getColumns() {
  if (!props.containerRef) return 0

  const width = props.containerRef.clientWidth

  if (width < 508) {
    return 1
  } else if (width < 766) {
    return 2
  } else if (width < 1024) {
    return 3
  } else {
    return 4
  }
}

watch(
  () => props.containerRef,
  () => {
    if (!props.containerRef) return

    currentAvailableColumns.value = getColumns()

    const resizeObserver = new ResizeObserver(() => {
      currentAvailableColumns.value = getColumns()
    })

    resizeObserver.observe(props.containerRef)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex gap-2">
    <div
      v-for="(columnItems, colIndex) in columns"
      :key="colIndex + generateUUID()"
      class="flex flex-col gap-2"
      style="width: 250px"
    >
      <slot :data="columnItems"></slot>
    </div>
  </div>
</template>
