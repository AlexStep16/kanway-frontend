<script setup lang="ts">
const props = defineProps<{
  before: {
    isFavorite?: boolean
  }
  after: {
    isFavorite?: boolean
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasFavoriteChange = computed(() => {
  if (props.before.isFavorite === undefined && props.after.isFavorite === undefined) return false

  return props.before.isFavorite !== props.after.isFavorite
})

function getFavoriteTitle(isFavorite?: boolean): string {
  if (isFavorite) return 'В избранном'
  else return 'Не в избранном'
}
</script>

<template>
  <div class="flex gap-1 flex-wrap" v-if="hasFavoriteChange">
    <div class="flex flex-wrap text-xs" :class="baseBlockBeforeClasses">
      {{ getFavoriteTitle(before.isFavorite) }}
    </div>

    <div
      class="flex flex-wrap text-xs"
      :class="baseBlockAfterClasses"
      v-if="after.isFavorite !== undefined"
    >
      {{ getFavoriteTitle(after.isFavorite) }}
    </div>
  </div>
</template>
