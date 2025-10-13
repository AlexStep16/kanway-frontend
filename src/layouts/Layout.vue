<template>
  <slot />
</template>

<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import '../styles/style.css'
import '../styles/spinner.css'
import '../styles/transitions.css'
import '../styles/fonts.css'

import { defaults } from 'mande'

defaults.credentials = 'include'
</script>
