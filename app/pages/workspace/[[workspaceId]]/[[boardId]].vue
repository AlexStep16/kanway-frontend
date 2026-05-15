<script setup lang="ts">
import WorkspaceView from '~/views/WorkspaceView.vue'

definePageMeta({
  authOnly: true,
  middleware: ['workspace'],
})
</script>

<template>
  <WorkspaceView></WorkspaceView>
</template>
