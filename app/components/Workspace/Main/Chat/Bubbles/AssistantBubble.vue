<script setup lang="ts">
import showdown from 'showdown'

defineProps<{
  text?: string
}>()

const textConverter = new showdown.Converter({
  tables: true,
  strikethrough: true,
  tasklists: true,
  simpleLineBreaks: true,
  ghCompatibleHeaderId: true,
  openLinksInNewWindow: true,
})
</script>

<template>
  <div
    class="prose-sm text-foreground overflow-x-auto"
    v-html="textConverter.makeHtml(text || '')"
  ></div>
</template>

<style lang="css" scoped>
.prose-sm :deep(li),
.prose-sm :deep(ul) {
  list-style: disc !important;
  list-style-type: disc !important;
}
</style>
