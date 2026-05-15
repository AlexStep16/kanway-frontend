<script setup lang="ts">
import { START_TILES } from '~/constants/START_TILES'
import KanwayLogo from '~/assets/kanway_logo.svg?skipsvgo'
import Button from '~/components/ui/button/Button.vue'
import { cn } from '~/lib/utils'

defineProps<{
  isMainChat?: boolean
}>()

defineEmits<{
  (e: 'tile-click', tile: (typeof START_TILES)[number]): void
}>()
</script>

<template>
  <div class="flex w-full flex-col items-center gap-y-6">
    <div class="flex flex-col flex-wrap justify-center items-center text-center">
      <KanwayLogo :class="cn('h-12 sm:w-55 sm:h-16', !isMainChat && 'h-8 sm:h-10')" />
      <h2
        :class="
          cn(
            'text-2xl sm:text-4xl font-bold mt-3 text-gray-700',
            !isMainChat && 'text-xl sm:text-2xl',
          )
        "
      >
        Что будем делать сегодня?
      </h2>
      <div class="flex items-center justify-center flex-wrap gap-2 mt-3">
        <Button
          size="sm"
          variant="outlinePrimary"
          v-for="tile of START_TILES"
          :key="tile.title"
          @click="$emit('tile-click', tile)"
        >
          <component :is="tile.iconComponent" class="size-4" />
          <span class="text-xs">{{ tile.title }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>
