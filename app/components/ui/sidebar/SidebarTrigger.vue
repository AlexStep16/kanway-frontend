<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PanelLeft } from '@lucide/vue'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar, open } = useSidebar()
</script>

<template>
  <TooltipProvider :disableHoverableContent="true">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          data-sidebar="trigger"
          variant="ghost"
          size="icon"
          :class="cn('h-7 w-7', props.class)"
          @click="toggleSidebar"
        >
          <PanelLeft />
          <span class="sr-only">Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent :sideOffset="-4">
        <p v-if="open">Свернуть боковое меню</p>
        <p v-else>Развернуть боковое меню</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
