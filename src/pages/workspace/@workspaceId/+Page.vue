<script lang="ts" setup>
import { clientOnly } from 'vike-vue/clientOnly'
const WorkspaceView = clientOnly(() => import('../WorkspaceView.vue'))
</script>

<template>
  <WorkspaceView></WorkspaceView>
</template>
