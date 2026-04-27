<script lang="ts" setup>
import { clientOnly } from 'vike-vue/clientOnly'
const BeginView = clientOnly(() => import('@views/BeginView.vue'))
</script>

<template>
  <BeginView></BeginView>
</template>
