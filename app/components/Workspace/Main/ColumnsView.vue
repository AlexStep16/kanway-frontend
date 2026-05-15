<script setup lang="ts">
import ShowMore from './Chat/ShowMore.vue'

const props = defineProps<{
  items: Array<any>
  containerRef: HTMLElement | null
  initialCountShown?: number
}>()

const currentAvailableColumns = ref(0)
const countShown = ref(props.initialCountShown || 0)

const columns = computed(() => {
  if (!currentAvailableColumns.value) return []

  const result: any = Array.from({ length: currentAvailableColumns.value }, () => [])

  limitedItems.value.forEach((item, index) => {
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

const limitedItems = computed(() => {
  if (!countShown.value) return props.items
  return props.items.slice(0, countShown.value)
})

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
  <div class="flex flex-col gap-y-2">
    <div class="flex gap-2">
      <div
        v-for="(columnItems, colIndex) in columns"
        :key="colIndex + generateUUID()"
        class="flex flex-col gap-2 w-62.5"
      >
        <slot :data="columnItems"></slot>
      </div>
    </div>

    <ShowMore
      class="w-62.5"
      @show-more="countShown += 10"
      v-if="countShown && countShown < items.length"
    />
  </div>
</template>
