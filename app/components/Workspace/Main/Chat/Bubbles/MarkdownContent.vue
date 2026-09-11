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
    class="prose prose-zinc prose-sm max-w-none text-zinc-800 overflow-x-auto leading-6 prose-chat"
    v-html="textConverter.makeHtml(text || '')"
  ></div>
</template>

<style scoped>
.prose-chat :deep(p) {
  margin-top: 0.25rem !important;
  margin-bottom: 0.5rem !important;
}

.prose-chat :deep(h1),
.prose-chat :deep(h2),
.prose-chat :deep(h3),
.prose-chat :deep(h4) {
  margin-top: 0.85rem !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.3 !important;
}

.prose-chat :deep(h4) {
  margin-bottom: 0.2rem !important;
}

.prose-chat :deep(hr) {
  margin-top: 0.75rem !important;
  margin-bottom: 0.75rem !important;
}

.prose-chat :deep(ul),
.prose-chat :deep(ol) {
  margin-top: 0.25rem !important;
  margin-bottom: 0.5rem !important;
  padding-left: 1.25rem !important;
}

.prose-chat :deep(li) {
  margin-top: 0.1rem !important;
  margin-bottom: 0.1rem !important;
}
</style>
